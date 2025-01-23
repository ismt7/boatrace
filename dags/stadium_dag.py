from airflow.decorators import dag, task
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators.email_operator import EmailOperator
import pendulum
from typing import Any, Dict

@dag(
    dag_id='レース場の統計取得',
    schedule_interval='0 7 * * *',
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Tokyo"),
    catchup=False,
    tags=["boatrace"],
)
def stadium_dag():
    """
    ボートレース場の情報を取得するDAG
    """
    call_api_tasks = []
    for i in range(1, 25):
        call_api_tasks.append(SimpleHttpOperator(
            task_id=f"boatrace_stadium_{i}",
            endpoint=f"/api/boatrace/stadium?jcd={i}",
            method="GET",
            http_conn_id="web_api"
        ))

    for i in range(1, 24):
        call_api_tasks[i-1] >> call_api_tasks[i]

stadium_dag_instance = stadium_dag()