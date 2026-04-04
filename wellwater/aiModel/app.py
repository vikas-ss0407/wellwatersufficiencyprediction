from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model and scaler
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'model', 'water_sufficiency_model.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), 'model', 'scaler.pkl')

try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✓ Model and scaler loaded successfully")
    print(f"  Model: {type(model).__name__}")
    print(f"  Scaler: {type(scaler).__name__}")
except Exception as e:
    print(f"⚠ Warning: Could not load model - {str(e)}")
    model = None
    scaler = None

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'message': 'AquaCortex Model Service',
        'version': '1.0.0',
        'status': 'operational' if model is not None else 'model_not_loaded'
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Extract features
        current_water_level = float(data.get('currentWaterLevel', 0))
        well_depth = float(data.get('wellDepth', 0))
        well_width = float(data.get('wellWidth', 0))
        temperature = float(data.get('temperature', 25))
        humidity = float(data.get('humidity', 60))
        tree_count = int(data.get('treeCount', 0))
        liters_per_tree = float(data.get('litersPerTree', 0))
        irrigation_start = data.get('irrigationStart', '')
        
        # Calculate features
        from datetime import datetime
        
        if irrigation_start:
            irrigation_date = datetime.fromisoformat(irrigation_start.replace('Z', '+00:00'))
            now = datetime.now()
            hours_until_irrigation = max(0, (irrigation_date - now).total_seconds() / 3600)
        else:
            hours_until_irrigation = 24
        
        # Convert sensor distance from CM to FT and calculate actual water height
        # current_water_level from ThingSpeak is sensor distance in CM (distance from sensor to water)
        sensor_distance_ft = current_water_level / 30.48  # Convert CM to FT
        water_height_ft = max(0, well_depth - sensor_distance_ft)  # Actual water depth in well
        
        # Well volume calculations (using corrected water height)
        well_volume_cubic_ft = well_depth * well_width * well_width * 3.14159 / 4
        current_water_volume_cubic_ft = water_height_ft * well_width * well_width * 3.14159 / 4
        available_water_l = current_water_volume_cubic_ft * 28.3168
        
        # Evaporation estimation
        if temperature > 30:
            evaporation_rate = 0.5
        elif temperature > 25:
            evaporation_rate = 0.3
        else:
            evaporation_rate = 0.1
            
        evaporation_loss = evaporation_rate * hours_until_irrigation
        
        # Leakage estimation (proportional to well dimensions)
        leakage_rate = (well_depth * 0.05 + well_width * 0.02)  # L/hour
        leakage_loss = leakage_rate * hours_until_irrigation
        
        # Required water
        required_water_l = tree_count * liters_per_tree
        safety_water_l = required_water_l * 0.1
        
        # Final usable water
        final_usable_water_l = max(0, available_water_l - evaporation_loss - leakage_loss - safety_water_l)
        
        is_sufficient = final_usable_water_l >= required_water_l
        
        # If model is available, use it for enhanced prediction
        if model is not None and scaler is not None:
            try:
                # Prepare features for model (adjust based on your training features)
                features = np.array([[
                    current_water_level,
                    well_depth,
                    well_width,
                    temperature,
                    humidity,
                    tree_count,
                    liters_per_tree,
                    hours_until_irrigation
                ]])
                
                # Scale features
                features_scaled = scaler.transform(features)
                
                # Get prediction
                prediction = model.predict(features_scaled)[0]
                
                # Use model prediction to adjust sufficiency
                is_sufficient = bool(prediction) if prediction in [0, 1] else is_sufficient
                
            except Exception as e:
                print(f"Model prediction error: {str(e)}")
                # Fall back to rule-based calculation
        
        result = {
            'isSufficient': is_sufficient,
            'currentWaterLevel': round(current_water_level, 2),
            'temperature': round(temperature, 1),
            'humidity': round(humidity, 1),
            'availableWaterL': round(available_water_l),
            'requiredWaterL': round(required_water_l),
            'finalUsableWaterL': round(final_usable_water_l),
            'safetyWaterL': round(safety_water_l),
            'evaporationLoss': round(evaporation_loss),
            'leakageLoss': round(leakage_loss),
            'hoursUntilIrrigation': round(hours_until_irrigation, 1),
            'message': f"Water is sufficient for {tree_count} tree(s)." if is_sufficient else "Water is not sufficient. Turn on bore motor.",
            'irrigationStart': irrigation_start,
            'treeCount': tree_count
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'message': 'Prediction failed'
        }), 500

if __name__ == '__main__':
    print("🤖 Starting AI Model Service...")
    app.run(host='0.0.0.0', port=5001, debug=True)
