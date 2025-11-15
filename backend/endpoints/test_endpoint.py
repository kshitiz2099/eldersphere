from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from repository.mongo_repository import MongoRepository
from typing import Optional

router = APIRouter()

# Initialize MongoDB repository
mongo_repo = MongoRepository()

class TestRecord(BaseModel):
    name: str
    message: str
    data: Optional[dict] = None

class TestRecordResponse(BaseModel):
    id: str
    message: str

@router.post("/test/write", response_model=TestRecordResponse)
async def write_test_record(record: TestRecord):
    """
    Write a test record to MongoDB
    """
    try:
        data = record.dict()
        record_id = mongo_repo.write_test_record(data)
        
        if record_id:
            return TestRecordResponse(
                id=record_id,
                message="Record written successfully to MongoDB"
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to write record to MongoDB")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/test/read/{record_id}")
async def read_test_record(record_id: str):
    """
    Read a test record from MongoDB by ID
    """
    try:
        record = mongo_repo.get_test_record(record_id)
        
        if record:
            return {"record": record, "message": "Record retrieved successfully"}
        else:
            raise HTTPException(status_code=404, detail="Record not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/test/all")
async def read_all_test_records():
    """
    Read all test records from MongoDB
    """
    try:
        records = mongo_repo.get_all_test_records()
        return {
            "count": len(records),
            "records": records,
            "message": "Records retrieved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
