from airflow.decorators import dag, task
from airflow.operators.http_operator import SimpleHttpOperator
from airflow.operators.email_operator import EmailOperator
import pendulum
from typing import Any, Dict
from airflow.operators.python import PythonOperator

@dag(
    dag_id='retrieve_motor_statistics',
    schedule_interval='0 7 * * *',
    start_date=pendulum.datetime(2025, 1, 1, tz="Asia/Tokyo"),
    catchup=False,
    tags=["boatrace"],
)
def motor_dag():
    """
    DAG to retrieve motor information for boat races
    """
    def get_execution_date(**kwargs):
        execution_date_str = kwargs['execution_date']
        execution_date = pendulum.parse(execution_date_str)
        execution_date_tz = pendulum.instance(execution_date).in_tz("Asia/Tokyo")
        return execution_date_tz.strftime('%Y%m%d')
    
    execution_date_task = PythonOperator(
        task_id='get_execution_date',
        python_callable=get_execution_date,
        op_kwargs={"execution_date": "{{ execution_date }}"}
    )

    call_api_tasks = [
        SimpleHttpOperator(
            task_id=f"boatrace_motor_{jcd_index}",
            endpoint=f"/api/boatrace/motor?jcd={jcd_index}",
            method="GET",
            http_conn_id="web_api",
            data={"hd": "{{ ti.xcom_pull(task_ids='get_execution_date') }}"},
        ) for jcd_index in range(1, 25)
    ]

    execution_date_task >> call_api_tasks[0]

    for jcd_index in range(1, 24):
        call_api_tasks[jcd_index-1] >> call_api_tasks[jcd_index]

motor_dag_instance = motor_dag()
