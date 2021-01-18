import random
import time
from enum import IntEnum

from flask import Flask, request, abort, jsonify
from flask_cors import CORS

app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False
CORS(app)

class States(IntEnum):
    IDLE = 1
    PICKING = 2
    PLACING = 3
    FAILED = 4
    REPAIRING = 5


state = States.IDLE


@app.route("/")
def get_root():
    return "This is the robot. Beep boop."


@app.route("/state")
def get_state():
    # return state.name
    return jsonify({'current_state': state.name, 'status_code': '200'})


@app.route("/action", methods=['POST'])
def actions():
    global state

    if random.random() < .05:
        state = States.FAILED

    if random.random() < .05:
        return abort(503, 'The robot did not respond. Beep boop.')

    try:
        action = request.get_json()['action']
    except:
        return abort(500, 'JSON not formatted properly')

    if state == States.IDLE:
        if action == 'start':
            state = States.PICKING
        elif action == 'repair':
            state = States.REPAIRING
        else:
            abort(500, 'Cannot execute command "%s" in state IDLE. Beep boop beep.' % action)

    elif state == States.PICKING:
        if action == 'place':
            time.sleep(2)
            state = States.PLACING
        elif action == 'repair':
            state = States.REPAIRING
        else:
            abort(500, 'Cannot execute command "%s" in state PICKING. Beep boop beep.' % action)

    elif state == States.PLACING:
        if action == 'done':
            time.sleep(2)
            state = States.IDLE
        elif action == 'reset':
            state = States.IDLE
        elif action == 'repair':
            state = States.REPAIRING
        else:
            abort(500, 'Cannot execute command "%s" in state PLACING. Beep boop beep.' % action)

    elif state == States.REPAIRING:
        if action == 'reset':
            time.sleep(2)
            state = States.IDLE
        else:
            abort(500, 'Cannot execute command "%s" in state REPAIR. Beep boop beep.' % action)

    elif state == States.FAILED:
        if action == 'reset':
            state = States.IDLE
        elif action == 'repair':
            state = States.REPAIRING
        else:
            abort(500, 'Cannot execute command "%s" in state FAILED. Beep boop beep.' % action)

    # Fake some execution time
    time.sleep(random.random() * 2)

    return jsonify({'current_state': state.name, 'status_code': '200'})


@app.errorhandler(500)
def handle_500_server_internal_error(error):
    index = str(error).index(':') + 2
    error_message = str(error)[index:]
    return jsonify({'error_message': error_message, 'status_code': '500'}), 500

@app.errorhandler(503)
def handle_503_service_unavailable_error(error):
    index = str(error).index(':') + 2
    error_message = str(error)[index:]
    return jsonify({'error_message': error_message, 'status_code': '503'}), 503

if __name__ == "__main__":
    app.run('0.0.0.0')