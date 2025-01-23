import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from flask import Flask, jsonify, request
from flasgger import Swagger
import os

app = Flask(__name__)
swagger = Swagger(app)

@app.route('/cluster', methods=['GET'])
def get_cluster():
    """
    クラスタリング結果と出目の確率を返却するエンドポイント
    ---
    tags:
      - Cluster
    parameters:
      - name: entry_order
        in: query
        type: string
        required: true
        description: 進入コースの順序 (例: "213465")
    responses:
      200:
        description: クラスタリング結果と出目の確率のリストを返します
    """
    # CSVファイルの読み込み
    csv_path = os.path.join(os.path.dirname(__file__), 'data', 'CourseArrivalRates.csv')
    df = pd.read_csv(csv_path)

    # リクエストから進入コースを取得
    entry_order = request.args.get('entry_order')
    if not entry_order or len(entry_order) != 6 or not entry_order.isdigit():
        return jsonify({"error": "Invalid entry order"}), 400

    entry_order = [int(x) for x in entry_order]

    # 出目の確率を計算
    probabilities = []
    for i in range(1, 7):
        for j in range(1, 7):
            for k in range(1, 7):
                if i != j and j != k and i != k:
                    prob = (df.iloc[entry_order[i-1]-1, 1] / 100) * (df.iloc[entry_order[j-1]-1, 2] / 100) * (df.iloc[entry_order[k-1]-1, 3] / 100)
                    probabilities.append({
                        "combination": f"{i}-{j}-{k}",
                        "probability": prob,
                    })

    # 確率の降順でソート
    probabilities = sorted(probabilities, key=lambda x: (int(x["combination"].split('-')[0]), int(x["combination"].split('-')[1]), int(x["combination"].split('-')[2])))

    return jsonify({"probabilities": probabilities})

@app.route('/health', methods=['GET'])
def health_check():
    """
    ヘルスチェック用エンドポイント
    ---
    tags:
      - Health
    responses:
      200:
        description: システムの状態を返します
    """
    return jsonify({"status": "ok"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3010)
