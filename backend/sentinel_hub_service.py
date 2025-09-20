from typing import List, Dict, Any
import os
import base64
import datetime
class SentinelHubService:
    def __init__(self):
        self.auth_url = "https://services.sentinel-hub.com/oauth/token"
        self.process_url = "https://services.sentinel-hub.com/api/v1/process"
        self.client_id = os.getenv("SH_CLIENT_ID")
        self.client_secret = os.getenv("SH_CLIENT_SECRET")
        self.access_token = None
        self.token_expires_at = None

    def _get_access_token(self) -> str:
        if self.access_token and self.token_expires_at and datetime.now() < self.token_expires_at:
            return self.access_token

        data = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "grant_type": "client_credentials"
        }
        resp = requests.post(self.auth_url, data=data)
        resp.raise_for_status()
        token_data = resp.json()
        self.access_token = token_data["access_token"]
        self.token_expires_at = datetime.now() + timedelta(seconds=token_data.get("expires_in", 3600))
        return self.access_token

    def _get_headers(self):
        return {
            "Authorization": f"Bearer {self._get_access_token()}",
            "Content-Type": "application/json"
        }

    def fetch_ndvi_image(self, bbox: List[float], width: int = 512, height: int = 512):
        evalscript = """
        //VERSION=3
        function setup() {
          return {
            input: [{ bands: ["B04", "B08"], units: "REFLECTANCE" }],
            output: { bands: 1, sampleType: "FLOAT32" }
          };
        }
        function evaluatePixel(sample) {
          return [(sample.B08 - sample.B04) / (sample.B08 + sample.B04)];
        }
        """

        payload = {
            "input": {
                "bounds": {"bbox": bbox},
                "data": [{"type": "sentinel-2-l2a"}]
            },
            "output": {
                "width": width,
                "height": height,
                "responses": [{
                    "identifier": "default",
                    "format": {"type": "image/png"}
                }]
            },
            "evalscript": evalscript
        }

        resp = requests.post(self.process_url, headers=self._get_headers(), json=payload)
        resp.raise_for_status()
        image_base64 = base64.b64encode(resp.content).decode("utf-8")

        return {
            "ndvi_image": image_base64,
            "bbox": bbox,
            "timestamp": datetime.now().isoformat()
        }
