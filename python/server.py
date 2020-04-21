import os
from dotenv import load_dotenv
from flask import Flask, render_template, url_for, jsonify, request, Response
from flask_pymongo import PyMongo
from bson import json_util
from bson.objectid import ObjectId
import json

app = Flask(__name__)

app.secret_key = os.getenv('secrect_key')

app.config['MONGO_URI'] = 'mongodb://localhost:27017/aprendices'

mongo = PyMongo(app)


@app.route('/')
def Index():
    return render_template('index.html')


@app.route('/apoyos', methods=['POST'])
def create_user():
    # Receiving Data
    fullname = request.json['fullname']
    email = request.json['email']
    phone = request.json['phone']
    type_doc = request.json['type_doc']
    num_doc = request.json['num_doc']
    ficha = request.json['ficha']

    if fullname and email and type_doc and num_doc and phone and ficha:
        id = mongo.db.apoyos.insert({
            'fullname': fullname,
            'email': email,
            'phone': phone,
            'type_doc': type_doc,
            'num_doc': num_doc,
            'ficha': ficha
        })
        response = jsonify(
            {'messsage': f'user: {str(id)} insert Successfully'})
        response.status_code = 201
        return response
    else:
        return not_found()


@app.route('/apoyos', methods=['GET'])
def get_users():
    apoyos = mongo.db.apoyos.find()
    response = json_util.dumps(apoyos)
    return Response(response, mimetype='application/json')


@app.route('/apoyos/<id>', methods=['GET'])
def get_user(id):
    aprendiz_monitor = mongo.db.apoyos.find_one({'_id': ObjectId(id), })
    response = json_util.dumps(aprendiz_monitor)
    return Response(response, mimetype='application/json')


@app.route('/apoyos/<id>', methods=['DELETE'])
def delete_user(id):
    mongo.db.apoyos.delete_one({'_id': ObjectId(id), })
    response = jsonify({'messsage': f'user: {id} Deleted Successfully'})
    response.status_code = 200
    return response


@app.route('/apoyos/<id>', methods=['PUT'])
def update_user(id):
    fullname = request.json['fullname']
    email = request.json['email']
    phone = request.json['phone']
    type_doc = request.json['type_doc']
    num_doc = request.json['num_doc']
    ficha = request.json['ficha']
    if fullname and email and type_doc and num_doc and phone and ficha:
        mongo.db.apoyos.update_one({
            '_id': ObjectId(id['$oid']) if '$oid' in id else ObjectId(id)}, {
                '$set': {
                    'fullname': fullname,
                    'email': email,
                    'phone': phone,
                    'type_doc': type_doc,
                    'num_doc': num_doc,
                    'ficha': ficha
                }})
        response = jsonify({'messsage': f'User: {id} Updated Successfuly'})
        response.status_code = 200
        return response
    else:
        return not_found()


@app.errorhandler(404)
def not_found(error=None):
    message = {
        'message': 'Resource Not Found ' + request.url,
        'status': 404
    }
    response = jsonify(message)
    response.status_code = 404
    return response


if __name__ == "__main__":
    app.run(debug=True)
