from flask import g
from flask_httpauth import HTTPBasicAuth, HTTPTokenAuth
from app.models import User
from app.api.errors import error_response

basic_auth = HTTPBasicAuth()

token_auth = HTTPTokenAuth()

@basic_auth.verify_password
def verfiy_password(username, password):
    '''检查用户提供的用户名和密码'''
    user = User.query.filter_by(username=username).first()
    if user is None:
        return False
    g.current_user = user
    return user.check_password(password)

@basic_auth.error_handler
def basic_auth_error():
    '''r认证失败时返回错误响应'''
    return error_response(401)

@token_auth.verify_token
def verify_token(token):
    '''检查用户请求是否有token， 并且token真实存在， 并且还在有效期'''
    g.current_user = User.check_token(token) if token else None
    return g.current_user is not None

@token_auth.error_handler
def token_auth_error():
    '''Token Auth 认证失败时返回错误响应'''
    return error_response(401)


