import os
import cv2
import numpy as np
from sklearn.cluster import DBSCAN
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from pathlib import Path
import shutil
from collections import defaultdict
from PIL import Image

SOURCE_DIR = r"C:\Users\User\OneDrive\Desktop\صوري"
OUTPUT_DIR = r"C:\Users\User\OneDrive\Desktop\صور_مصنفة"
MIN_FACE_SIZE = (80, 80)
FACE_SIZE = (64, 64)
DBSCAN_EPS = 0.4
MIN_SAMPLES = 1
PCA_COMPONENTS = 40

IMAGE_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'}


def load_haar_cascade():
    cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    return cv2.CascadeClassifier(cascade_path)


def extract_face_features(gray_face):
    resized = cv2.resize(gray_face, FACE_SIZE)
    eq = cv2.equalizeHist(resized)
    hog = cv2.HOGDescriptor(FACE_SIZE, (16, 16), (8, 8), (8, 8), 9)
    features = hog.compute(eq)
    return features.flatten()


def detect_faces(cascade, image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    faces = cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5,
                                     minSize=MIN_FACE_SIZE)
    return faces, gray


def process_image(cascade, image_path):
    pil_img = Image.open(str(image_path)).convert('RGB')
    img = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)
    faces, gray = detect_faces(cascade, img)
    results = []
    for (x, y, w, h) in faces:
        face_roi = gray[y:y + h, x:x + w]
        features = extract_face_features(face_roi)
        results.append({'image_path': str(image_path), 'bbox': (x, y, w, h),
                        'features': features})
    return results


def main():
    print("=" * 60)
    print("   تنظيم الصور حسب الوجوه - Face Photo Organizer")
    print("=" * 60)

    if not os.path.exists(SOURCE_DIR):
        print(f"\n\u274c المجلد {SOURCE_DIR} غير موجود")
        return

    print("\n\U0001f4e6 تحميل كاشف الوجوه...")
    cascade = load_haar_cascade()

    print(f"\U0001f50d فحص المجلد {SOURCE_DIR}...")
    image_files = []
    for ext in IMAGE_EXTENSIONS:
        image_files.extend(Path(SOURCE_DIR).rglob(f"*{ext}"))
        image_files.extend(Path(SOURCE_DIR).rglob(f"*{ext.upper()}"))
    image_files = sorted(set(image_files))
    print(f"\U0001f4f8 تم العثور على {len(image_files)} صورة")

    if not image_files:
        print("\u274c لا توجد صور في المجلد")
        return

    print("\n\U0001f50e معالجة الصور والبحث عن وجوه...")
    all_features = []
    face_to_image = []

    for i, img_path in enumerate(image_files):
        if i % 10 == 0:
            print(f"  تقدم: {i}/{len(image_files)}")
        faces = process_image(cascade, img_path)
        for face_data in faces:
            all_features.append(face_data['features'])
            face_to_image.append(face_data)

    print(f"\U0001f464 تم اكتشاف {len(all_features)} وجه في المجموع")

    if len(all_features) == 0:
        print("\u274c لم يتم العثور على أي وجوه في الصور")
        return

    if len(all_features) == 1:
        print("وجه واحد فقط، سيتم وضعه في مجلد واحد")
        clusters = [0]
    else:
        print("\n\U0001f9e0 تجميع الوجوه المتشابهة...")
        X = np.array(all_features)
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)

        n_comp = min(PCA_COMPONENTS, X_scaled.shape[0], X_scaled.shape[1])
        if n_comp < X_scaled.shape[1]:
            print(f"  PCA: {X_scaled.shape[1]} \u2192 {n_comp}")
            pca = PCA(n_components=n_comp)
            X_reduced = pca.fit_transform(X_scaled)
        else:
            X_reduced = X_scaled

        clustering = DBSCAN(eps=DBSCAN_EPS, min_samples=MIN_SAMPLES,
                            metric='cosine')
        clusters = clustering.fit_predict(X_reduced)

    n_clusters = len(set(clusters)) - (1 if -1 in clusters else 0)
    n_noise = list(clusters).count(-1)
    print(f"\U0001f4ca تم تجميع الوجوه في {n_clusters} مجموعة"
          + (f" ({n_noise} غير مصنف)" if n_noise else ""))

    print(f"\n\U0001f4c1 إنشاء المجلدات في {OUTPUT_DIR}...")
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    image_clusters = defaultdict(set)
    for idx, cluster_id in enumerate(clusters):
        label = f"Person_{cluster_id + 1}" if cluster_id != -1 else "غير_مصنف"
        image_clusters[label].add(face_to_image[idx]['image_path'])

    for label, img_paths in sorted(image_clusters.items()):
        folder = os.path.join(OUTPUT_DIR, label)
        os.makedirs(folder, exist_ok=True)
        for img_path in img_paths:
            dest = os.path.join(folder, os.path.basename(img_path))
            if os.path.exists(dest):
                name, ext = os.path.splitext(os.path.basename(img_path))
                dest = os.path.join(folder, f"{name}_copy{ext}")
            shutil.copy2(img_path, dest)
        print(f"  \U0001f4c2 {label}: {len(img_paths)} صورة")

    print(f"\n\u2705 تم الانتهاء!")
    print(f"المجلدات موجودة في: {OUTPUT_DIR}")
    print(f"\n\u2728 الملخص:")
    print(f"  \U0001f4f8 إجمالي الصور: {len(image_files)}")
    print(f"  \U0001f464 إجمالي الوجوه: {len(all_features)}")
    print(f"  \U0001f4ca عدد المجموعات: {n_clusters}")
    for label, img_paths in sorted(image_clusters.items()):
        print(f"    {label}: {len(img_paths)} صورة")


if __name__ == "__main__":
    main()
