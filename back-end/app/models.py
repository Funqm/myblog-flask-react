import base64
from datetime import datetime, timedelta
from hashlib import md5
import json
import jwt
from time import time
from werkzeug.security import generate_password_hash, check_password_hash
from flask import url_for, current_app
from app import db



class PaginatedAPIMixin(object):
    @staticmethod
    def to_collection_dict(query, page, per_page, endpoint, **kwargs):
        resources = query.paginate(page, per_page, False)
        
        data = {
            'items': [item.to_dict() for item in resources.items],
            '_meta': {
                'page': page,
                'per_page': per_page,
                'total_pages': resources.pages,
                'total_items': resources.total
            },
            '_links': {
                'self': url_for(endpoint, page=page, per_page=per_page, **kwargs),
                'next': url_for(endpoint, page=page + 1, per_page=per_page, **kwargs) if resources.has_next else None,
                'prev': url_for(endpoint, page=page - 1, per_page=per_page, **kwargs) if resources.has_prev else None
            }
        }
        
        return data

followers = db.Table(
    'followers',
    db.Column('follower_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('followed_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)

)

comments_likes = db.Table(
    'comments_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('comment_id', db.Integer, db.ForeignKey('comments.id')),
    db.Column('timestamp', db.DateTime, default=datetime.utcnow)
)


class User(db.Model, PaginatedAPIMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), index=True, unique=True)
    email = db.Column(db.String(120), index=True, unique=True)
    password_hash = db.Column(db.String(128))  # 不保存原始密码
    name = db.Column(db.String(64))
    location = db.Column(db.String(64))
    about_me = db.Column(db.Text())
    member_since = db.Column(db.DateTime(), default=datetime.utcnow)
    last_seen = db.Column(db.DateTime(), default=datetime.utcnow)

    posts = db.relationship('Post', backref='author', lazy='dynamic',
                            cascade='all, delete-orphan')

    comments = db.relationship('Comment', backref='author', lazy='dynamic',
                               cascade='all, delete-orphan')


    #followeds 是用户关注了那些用户列表
    #followers 是用户的粉丝列表
    followeds = db.relationship(
        'User', secondary=followers,
        primaryjoin=(followers.c.follower_id == id),
        secondaryjoin=(followers.c.followed_id == id),
        backref=db.backref('followers', lazy='dynamic'),
        lazy='dynamic')

   

    def __repr__(self):
        return '<User {}>'.format(self.username)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_email=False):
        
        data = {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'location': self.location,
            'about_me': self.about_me,
            'member_since': self.member_since.isoformat() + 'Z',
            'last_seen': self.last_seen.isoformat() + 'Z',
            '_links': {
                'self': url_for('api.get_user', id=self.id),
                'avatar': self.avatar(128)
            }
        }
        #用户请求自己数据时候才包含email
        if include_email:
            data['email'] = self.email
        
        
        return data

    def from_dict(self, data, new_user=False):
        for filed in ['username', 'email', 'name', 'location', 'about_me']:
            if filed in data:
                setattr(self, filed, data[filed])
        if new_user and 'password' in data:
            self.set_password(data['password'])
    
    def get_jwt(self, expires_in=6000):
        now =datetime.utcnow()
        payload = {
            'user_id': self.id,
            'name': self.name if self.name else self.username,
            'exp':now + timedelta(seconds=expires_in),
            'iat': now  
        }
        return jwt.encode(
            payload,
            current_app.config['SECRET_KEY'],
            algorithm='HS256')
    
    @staticmethod
    def verify_jwt(token):
        try:
            payload = jwt.decode(
                token,
                current_app.config['SECRET_KEY'],
                algorithms=['HS256']
            )
        except (jwt.exceptions.ExpiredSignatureError, jwt.exceptions.InvalidSignatureError) as e:
            # Token 过期或者被修改
            return None
        return User.query.get(payload.get('user_id'))
    
    def avatar(self, size):
        '''头像'''
        digest = md5(self.email.lower().encode('utf-8')).hexdigest()
        return 'https://www.gravatar.com/avatar/{}?d=identicon&s={}'.format(digest, size)

    def is_following(self, user):
        '''判断当前用户是否已经关注了user这个用户对象'''
        return self.followeds.filter(followers.c.followed_id == user.id).count() > 0
    
    def follow(self, user):
        '''当前用户开始关注user这个对象'''
        if not(self.is_following(user)):
            self.followeds.append(user)
    
    def unfollow(self, user):
        '''当前用户取消关注user这个用户对象'''
        if self.is_following(user):
            self.followeds.remove(user)
    
    @property
    def followed_posts(self):
        '''获取当前用户的关注者的所有文章列表'''
        followed = Post.query.join(
            followers, (followers.c.followed_id == Post.author_id)).filter(
                followers.c.follower_id == self.id)
        # 包含当前用户自己的文章列表
        # own = Post.query.filter_by(user_id=self.id)
        # return followed.union(own).order_by(Post.timestamp.desc())
        return followed.order_by(Post.timestamp.desc())

class Post(PaginatedAPIMixin, db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    summary = db.Column(db.Text)
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index = True, default=datetime.utcnow)
    views = db.Column(db.Integer, default=0)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    comments = db.relationship('Comment', backref='post', lazy='dynamic',
                               cascade='all, delete-orphan')

    def __repr__(self):
        return '<Post {}>'.format(self.title)
    
    

    @staticmethod
    def on_change_body(target, value, oldvalue, initiator):
        if not target.summary:  # 如果前端不填写摘要，是空str，而不是None
            target.summary = value[:200] + '  ... ...'  # 截取 body 字段的前200个字符给 summary
    
    def to_dict(self):
        print(self)
        data = {
            'id': self.id,
            'title': self.title,
            'summary': self.summary,
            'body': self.body,
            'timestamp': self.timestamp,
            'views': self.views,
            'author': self.author.to_dict(),
            '_links': {
                'self': url_for('api.get_post', id=self.id),
                'author_url': url_for('api.get_user', id=self.author_id)
            }
        }
        return data
    
    def from_dict(self, data):
        for field in ['title', 'summary', 'body']:
            if field in data:
                setattr(self, field, data[field])

class Comment(PaginatedAPIMixin, db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    body = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    mark_read = db.Column(db.Boolean, default=False)  # 文章作者会收到评论提醒，可以标为已读
    disabled = db.Column(db.Boolean, default=False)  # 屏蔽显示
    # 评论与对它点赞的人是多对多关系
    likers = db.relationship('User', secondary=comments_likes, backref=db.backref('liked_comments', lazy='dynamic'), lazy='dynamic')
    # 外键，评论作者的 id
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    # 外键，评论所属文章的 id
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'))
    # 自引用的多级评论实现
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id', ondelete='CASCADE'))
    # 级联删除的 cascade 必须定义在 "多" 的那一侧，所以不能这样定义: parent = db.relationship('Comment', backref='children', remote_side=[id], cascade='all, delete-orphan')
    parent = db.relationship('Comment', backref=db.backref('children', cascade='all, delete-orphan'), remote_side=[id])

    def __repr__(self):
        return '<Comment {}>'.format(self.id)

    def get_descendants(self):
        '''获取评论的所有子孙'''
        data = set()

        def descendants(comment):
            if comment.children:
                data.update(comment.children)
                for child in comment.children:
                    descendants(child)
        descendants(self)
        return data

    def get_ancestors(self):
        '''获取评论的所有祖先'''
        data = []

        def ancestors(comment):
            if comment.parent:
                data.append(comment.parent)
                ancestors(comment.parent)
        ancestors(self)
        return data

    def to_dict(self):
        data = {
            'id': self.id,
            'body': self.body,
            'timestamp': self.timestamp,
            'mark_read': self.mark_read,
            'disabled': self.disabled,
            'likers_id': [user.id for user in self.likers],
            'author': {
                'id': self.author.id,
                'username': self.author.username,
                'name': self.author.name,
                'avatar': self.author.avatar(128)
            },
            'post': {
                'id': self.post.id,
                'title': self.post.title,
                'author_id': self.post.author.id
            },
            'parent_id': self.parent.id if self.parent else None,
            # 'children': [child.to_dict() for child in self.children] if self.children else None,
            '_links': {
                'self': url_for('api.get_comment', id=self.id),
                'author_url': url_for('api.get_user', id=self.author_id),
                'post_url': url_for('api.get_post', id=self.post_id),
                'parent_url': url_for('api.get_comment', id=self.parent.id) if self.parent else None,
                'children_url': [url_for('api.get_comment', id=child.id) for child in self.children] if self.children else None
            }
        }
        return data

    def from_dict(self, data):
        for field in ['body', 'timestamp', 'mark_read', 'disabled', 'author_id', 'post_id', 'parent_id']:
            if field in data:
                setattr(self, field, data[field])

    def is_liked_by(self, user):
        '''判断用户 user 是否已经对该评论点过赞'''
        return user in self.likers

    def liked_by(self, user):
        '''点赞'''
        if not self.is_liked_by(user):
            self.likers.append(user)

    def unliked_by(self, user):
        '''取消点赞'''
        if self.is_liked_by(user):
            self.likers.remove(user)
