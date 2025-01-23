from airflow.decorators import dag, task
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators.email_operator import EmailOperator
import pendulum
import json
from typing import Any, Dict
from airflow.utils.dates import days_ago
from airflow.operators.python import get_current_context, PythonOperator

@dag(
    dag_id='レース終了情報の更新',
    schedule_interval='* 8-23 * * *',
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Tokyo"),
    catchup=False,
    tags=["boatrace"],
)
def race_dag():
    """
    レースが終了したレコードに終了フラグを立てるDAG
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

    call_api_task = SimpleHttpOperator(
        task_id="boatrace_race",
        method="POST",
        http_conn_id="web_api",
        endpoint="/api/race/finish",
        data=json.dumps({"raceDate": "{{ ti.xcom_pull(task_ids='get_execution_date') }}"}),
        headers={"Content-Type": "application/json"},
    )

    execution_date_task >> call_api_task

race_dag_instance = race_dag()