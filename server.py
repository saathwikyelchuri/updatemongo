# import os
# import cv2
# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from deepface import DeepFace;

# app = Flask(__name__)
# CORS(app)  # Enable CORS for the entire app

# BASE_IMAGE_FOLDER = r"D:\Face-Expression-Tracker\Back-end\photos"
# SUPPORTED_EXTENSIONS = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')

# @app.route('/analyze_emotions', methods=['GET'])
# def analyze_emotions():
#     # Get child and session parameters from the request
#     child = request.args.get('child')
#     session = request.args.get('session')

#     if not child or not session:
#         return jsonify({"error": "Child or session ID not provided."}), 400

#     image_folder = os.path.join(BASE_IMAGE_FOLDER, child, session)
#     if not os.path.exists(image_folder):
#         return jsonify({"error": f"Folder {image_folder} does not exist."}), 404

#     # List and analyze images
#     image_files = [
#         f for f in os.listdir(image_folder)
#         if f.lower().endswith(SUPPORTED_EXTENSIONS) and not f.lower().startswith("screenshot")
#     ]
#     results = []

#     if not image_files:
#         return jsonify({"error": f"No valid images found in folder: {image_folder}"}), 404

#     for image_file in image_files:
#         image_path = os.path.join(image_folder, image_file)

#         img = cv2.imread(image_path)
#         if img is None:
#             results.append({"file": image_file, "error": f"Unable to load the image at {image_path}."})
#             continue

#         try:
#             res = DeepFace.analyze(img, actions=['emotion'], detector_backend='opencv')
#             if isinstance(res, list):
#                 res = res[0]

#             emotions = res['emotion']
#             max_emotion = max(emotions, key=emotions.get)

#             results.append({
#                 "file": image_file,
#                 "emotions": {emotion: f"{score:.2f}%" for emotion, score in emotions.items()},
#                 "dominant_emotion": max_emotion,
#                 "dominant_score": f"{emotions[max_emotion]:.2f}%"
#             })
#         except Exception as e:
#             results.append({"file": image_file, "error": str(e)})

#     return jsonify(results)

# if __name__ == '__main__':
#     app.run(host="0.0.0.0", port=5000)




# from flask import Flask, request, jsonify
# import os
# import numpy as np
# import cv2
# from deepface import DeepFace

# app = Flask(__name__)

# @app.route('/analyze-folder', methods=['POST'])
# def analyze_folder():
#     files = request.files.getlist('images')
#     if not files:
#         return jsonify({"error": "No files provided"}), 400

#     results = []
#     for file in files:
#         img_data = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

#         if img is None:
#             results.append({"filename": file.filename, "error": "Invalid image"})
#             continue

#         try:
#             analysis = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
#             emotions = analysis['emotion']
#             max_emotion = max(emotions, key=emotions.get)

#             results.append({
#                 "filename": file.filename,
#                 "emotions": emotions,
#                 "dominant_emotion": {
#                     "emotion": max_emotion,
#                     "score": emotions[max_emotion]
#                 }
#             })
#         except Exception as e:
#             results.append({"filename": file.filename, "error": str(e)})

#     return jsonify(results), 200

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)




# from flask import Flask, request, jsonify
# import os
# import numpy as np
# import cv2
# from deepface import DeepFace

# app = Flask(__name__)

# @app.route('/analyze-folder', methods=['POST'])
# def analyze_folder():
#     files = request.files.getlist('images')
#     if not files:
#         return jsonify({"error": "No files provided"}), 400

#     results = []
#     for file in files:
#         img_data = np.frombuffer(file.read(), np.uint8)
#         img = cv2.imdecode(img_data, cv2.IMREAD_COLOR)

#         if img is None:
#             results.append({"filename": file.filename, "error": "Invalid image"})
#             continue

#         try:
#             analysis = DeepFace.analyze(img, actions=['emotion'], enforce_detection=False)
#             emotions = analysis['emotion']
#             max_emotion = max(emotions, key=emotions.get)

#             results.append({
#                 "filename": file.filename,
#                 "emotions": emotions,
#                 "dominant_emotion": {
#                     "emotion": max_emotion,
#                     "score": emotions[max_emotion]
#                 }
#             })
#         except Exception as e:
#             results.append({"filename": file.filename, "error": str(e)})

#     return jsonify(results), 200

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

# from flask import Flask, request, jsonify
# import os
# import cv2
# from deepface import DeepFace
# from flask_cors import CORS

# app = Flask(__name__)

# # Enable CORS for the frontend (React app running on localhost:5173)
# CORS(app)

# # Define the folder where images are stored
# # BASE_IMAGE_FOLDER = r"Back-end\photos"  # Adjust the path to match your directory structure

# @app.route('/analyze', methods=['POST'])
# def analyze_session():
#     """
#     Analyze images in a specific session folder for emotions using DeepFace.
#     """
#     try:
#         data = request.json
#         # childname = data.get('childname')
#         # sessionid = data.get('sessionid')
#         BASE_IMAGE_FOLDER=data.get('filepath')

#         # Validate input
#         if not BASE_IMAGE_FOLDER :
#             return jsonify({"error":"folder does not exist"}), 400
#         # if not childname or not sessionid:
#         #     return jsonify({"error": "Child name and session ID are required"}), 400

#         # Construct the session folder path
#         # session_folder = os.path.join(BASE_IMAGE_FOLDER, childname, sessionid)

#         # Check if the session folder exists
#         # if not os.path.exists(session_folder):
#         #     return jsonify({"error": f"Session folder '{session_folder}' does not exist"}), 404

#         # List supported image files in the session folder
#         supported_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
#         image_files = [f for f in BASE_IMAGE_FOLDER if f.lower().endswith(supported_extensions) and not f.lower().startswith("screenshot")]

#         # Return error if no valid images are found
#         if not image_files:
#             return jsonify({"error": "No valid images found in the session folder"}), 404

#         results = []
#         for image_file in image_files:
#             image_path = os.path.join(BASE_IMAGE_FOLDER, image_file)
#             img = cv2.imread(image_path)

#             if img is None:
#                 results.append({"image": image_file, "error": "Unable to load image"})
#                 continue

#             try:
#                 # Analyze emotions in the image
#                 res = DeepFace.analyze(img, actions=['emotion'], detector_backend='opencv')
#                 if isinstance(res, list):
#                     res = res[0]

#                 emotions = res['emotion']
                
#                 # Convert numpy.float32 values to native Python float
#                 emotions = {k: float(v) for k, v in emotions.items()}
                
#                 max_emotion = max(emotions, key=emotions.get)
#                 results.append({
#                     "image": image_file,
#                     "emotions": emotions,
#                     "max_emotion": max_emotion
#                 })

#             except Exception as e:
#                 results.append({"image": image_file, "error": str(e)})

#         return jsonify(results)

#     except Exception as e:
#         # Log any unexpected error
#         print(f"Error in analyze_session: {str(e)}")
#         return jsonify({"error": "An unexpected error occurred"}), 500

# if __name__ == '__main__':
#     # Run the Flask server on localhost and port 5000
#     app.run(debug=True, port=5000)



from flask import Flask, request, jsonify
import os
import cv2
from deepface import DeepFace
from flask_cors import CORS
import requests  # Import the requests library for making HTTP requests

app = Flask(__name__)
CORS(app)

EXPRESS_SERVER_URL = "http://localhost:3000/me"  # URL of the Express server

@app.route('/analyze', methods=['POST'])
def analyze_session():
    """
    Analyze images in a specific session folder for emotions using DeepFace.
    """
    try:
        # Get JSON data from the request
        data = request.json
        childname=data.get('childname')
        sessionid=data.get('sessionid')
        BASE_IMAGE_FOLDER = data.get('filePath')

        print("Received folder path:", BASE_IMAGE_FOLDER)  # Debug log

        # Validate input
        if not os.path.exists(BASE_IMAGE_FOLDER):
            print("Invalid folder path provided.")
            return jsonify({"error": "Provided folder does not exist"}), 400

        # List supported image files in the folder
        supported_extensions = ('.jpg', '.jpeg', '.png', '.bmp', '.gif')
        image_files = [
            f for f in os.listdir(BASE_IMAGE_FOLDER)
            if f.lower().endswith(supported_extensions) and not f.lower().startswith("screenshot")
        ]

        print("Image files found:", image_files)  # Debug log

        if not image_files:
            print("No valid images found in the folder.")
            return jsonify({"error": "No valid images found in the folder"}), 404

        results = []
        for image_file in image_files:
            image_path = os.path.join(BASE_IMAGE_FOLDER, image_file)
            print("Processing image:", image_path)  # Debug log

            img = cv2.imread(image_path)
            if img is None:
                print(f"Unable to load image: {image_file}")
                results.append({"image": image_file, "error": "Unable to load image"})
                continue

            try:
                print("Analyzing image with DeepFace:", image_path)  # Debug log
                res = DeepFace.analyze(img, actions=['emotion'], detector_backend='opencv')
                print("DeepFace analysis result:", res)  # Debug log

                if isinstance(res, list):
                    res = res[0]

                emotions = res['emotion']
                emotions = {k: float(v) for k, v in emotions.items()}
                max_emotion = max(emotions, key=emotions.get)

                results.append({
                    "childname":childname,
                    "sessionid":sessionid,
                    "image": image_file,
                    "emotions": emotions,
                    "max_emotion": max_emotion
                })

            except Exception as e:
                print(f"Error analyzing image {image_file}: {str(e)}")
                results.append({"image": image_file, "error": str(e)})

        print("Final analysis results:", results)  # Debug log

        # Send results to the Express server
        try:
            response = requests.post(EXPRESS_SERVER_URL, json={"results": results,"childname": childname,"sessionid": sessionid})
            if response.status_code == 200:
                print("Results sent to Express server successfully.")
            else:
                print("Failed to send results to Express server:", response.text)
        except Exception as e:
            print(f"Error sending results to Express server: {str(e)}")

        return jsonify(results)

    except Exception as e:
        print(f"Error in analyze_session: {str(e)}")
        return jsonify({"error": "An unexpected error occurred"}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
