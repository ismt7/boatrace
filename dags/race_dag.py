from airflow.decorators import dag, task
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators.email_operator import EmailOperator
import pendulum
from typing import Any, Dict
from airflow.utils.dates import days_ago
from airflow.operators.python import get_current_context, PythonOperator

@dag(
    dag_id='レース一覧取得',
    schedule_interval='0 7 * * *',
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Tokyo"),
    catchup=False,
    tags=["boatrace"],
)
def race_dag():
    """
    ボートレース場で開催されるレースの情報を取得するDAG
    """
    def get_execution_date(**kwargs):
        execution_date = kwargs['execution_date']
        execution_date_tz = pendulum.instance(execution_date).in_tz("Asia/Tokyo")
        return execution_date_tz.strftime('%Y%m%d')

    execution_date_task = PythonOperator(
        task_id='get_execution_date',
        python_callable=get_execution_date,
        provide_context=True
    )

    call_api_tasks = []
    for i in range(1, 25):
        call_api_tasks.append(SimpleHttpOperator(
            task_id=f"boatrace_race_{i}",
            endpoint=f"/api/boatrace/raceindex?jcd={i}",
            method="GET",
            http_conn_id="web_api",
            data={"hd": "{{ ti.xcom_pull(task_ids='get_execution_date') }}"},
        ))

    execution_date_task >> call_api_tasks

race_dag_instance = race_dag()