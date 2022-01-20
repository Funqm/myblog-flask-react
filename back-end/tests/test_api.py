from base64 import b64encode
from datetime import datetime
from email import header
from urllib import response
from wsgiref import headers
from datetime import datetime, timedelta
import json
import re
import unittest
from app import create_app, db
from app.models import User, Post
from tests import TestConfig

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app(TestConfig)
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()

    def tearDown(self) -> None:
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    ###
    # 404等错误处理
    ###
    def test_404(self):
        '''测试请求不存的API时'''
        response = self.client.get('/api/wrong/url')
        self.assertEqual(response.status_code, 404)
        json_response = json.loads(response.get_data(as_text=True))
        self.assertEqual(json_response['error'], 'Not Found')

    ###
    # 用户认证相关测试
    ###
    def get_basic_auth_headers(self, username, password):
        '''创建Basic Auth 认证的headers'''
        return {
            'Authorization': 'Basic ' + b64encode(
                (username + ":" + password).encode('utf-8')
            ).decode('utf-8'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    
    def get_token_auth_headers(self, username, password):
        '''创建JSON Web Token认证的headers'''
        headers= self.get_basic_auth_headers(username, password)
        response = self.client.post('/api/tokens', headers=headers)
        self.assertEqual(response.status_code, 200)
        json_response = json.loads(response.get_data(as_text=True))
        self.assertIsNotNone(json_response.get('token'))
        token = json_response['token']
        return {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }

    def test_get_token(self):
        '''测试用户和登陆， 即获取JWT， 输入正确的用户名和密码，通过Basic Auth后发放JWT立牌'''
        # 创建用户
        u = User(username="john", email='john@163.com')
        u.set_password('123')
        db.session.add(u)
        db.session.commit()
        
        # 输入错误的用户密码
        headers = self.get_basic_auth_headers('john', '456')
        response = self.client.post('/api/tokens', headers=headers)
        self.assertEqual(response.status_code, 401)

        #输入正确的用户密码
        headers = self.get_basic_auth_headers('john', '123')
        response = self.client.post('/api/tokens', headers=headers)
        self.assertEqual(response.status_code, 200)
        json_response = json.loads(response.get_data(as_text=True))
        self.assertIsNotNone(json_response.get('token'))
        self.assertTrue(re.match(r'(.+)\.(.+)\.(.+)', json_response.get('token')))

    def test_not_attach_jwt(self):
        # 测试请求头Authorization中没有附带JWT时，会返回401错误
        response = self.client.get('/api/users/')
        self.assertEqual(response.status_code, 401)

    def test_attach_jwt(self):
        # 测试请求头Authorization中有附带JWT时，允许访问那些需要认证的API
        # 首先创建一个测试用户
        u = User(username='john', email='john@163.com')
        u.set_password('123')
        db.session.add(u)
        db.session.commit()
        # 附带JWT到请求头中
        headers = self.get_token_auth_headers('john', '123')
        response = self.client.get('/api/users/', headers=headers)
        self.assertEqual(response.status_code, 200)

    def test_anonymous(self):
        # 有些API不需要认证，比如 /api/posts/
        response = self.client.get('/api/posts')
        self.assertEqual(response.status_code, 200)

