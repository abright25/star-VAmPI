from config import vuln_app
import os
import logging

'''
 Decide if you want to server a vulnerable version or not!
 DO NOTE: some functionalities will still be vulnerable even if the value is set to 0
          as it is a matter of bad practice. Such an example is the debug endpoint.
'''
vuln = int(os.getenv('vulnerable', 1))
# vuln=1
# token alive for how many seconds?
alive = int(os.getenv('tokentimetolive', 60))

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# start the app with port 5000 and debug on!
if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    try:
        logger.info(f"Starting vuln_app on port {port} with vulnerable={vuln} and tokentimetolive={alive}")
        vuln_app.run(host='0.0.0.0', port=port, debug=False)
    except Exception as e:
        logger.error(f"Failed to start vuln_app: {e}")
        raise
