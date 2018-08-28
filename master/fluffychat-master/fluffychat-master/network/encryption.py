'''
This module includes Encryptor class that provides
message encryption and decryption
'''


import json
import base64
import Crypto

from Crypto import Random
from Crypto.PublicKey import RSA
from Crypto.Hash import SHA256


class Encryptor:
    def __init__(self, client):
        self.key_length = 2048
        self.random_gen = Random.new().read
        self._user2pubkey = {}
        self._dis_enc = set()

        self._client = client

        self._generate_keys()

    def add_pubkey(self, user_id, pubkey, _self=False, dis_enc=False):
        ''' Add public key of a host in chat to the dictionary '''
        if _self:
            self._user2pubkey[user_id] = self.pubkey
        else:
            self._user2pubkey[user_id] = RSA.importKey(pubkey)
        if dis_enc:
            self._dis_enc.add(user_id)
        else:
            try:
                self._dis_enc.remove(user_id)
            except Exception as e:
                pass

    def get_pubkey(self, user_id):
        return self._user2pubkey[user_id].exportKey().decode('utf-8')

    def _generate_keys(self):
        ''' Generate private/public RSA keys '''

        self._keypair = RSA.generate(self.key_length, self.random_gen)
        self.pubkey = self._keypair.publickey()

    def encrypt(self, user_id, host, message):
        '''
        Encrypt sending message with RSA. If encryption is disabled then
        return message itself.

        Args:
            user_id (int) Id of a user that receives message
            message (bytes) Message itself
        Return:
            tuple First is signature and second is encrypted message itself
        '''

        if user_id in self._dis_enc:
            return message
        # if message isn't bytes then convert it
        try:
            bytes(message)
        except TypeError:
            message = bytes(message, 'utf-8')

        message_hash = SHA256.new(message).digest()
        signature = self._keypair.sign(message_hash, '')
        encrypted_msg = self._user2pubkey[user_id].encrypt(message, 32)
        return json.dumps({
            'signature': signature[0],
            'host': list(host),
            'encrypted_msg': base64.b64encode(encrypted_msg[0]).decode()})

    def decrypt(self, signature, encrypted_msg, host):
        '''
        Decrypt received message. If this message can't be verified then
        return None.

        Args:
            encrypted_msg (bytes) Encrypted message from a user in the chat
        Return:
            None if message isn't verified else decrypted message
        '''

        user_id = self._client.host2user_id[host]
        decrypted_msg = self._keypair.decrypt(encrypted_msg)
        decrypted_msg_hash = SHA256.new(decrypted_msg).digest()

        if self.verify(decrypted_msg_hash, signature, user_id):
            return decrypted_msg.decode('utf-8')

    def verify(self, _hash, sign, user_id):
        ''' Verify message hash by signature '''
        return self._user2pubkey[user_id].verify(_hash, (sign,))

    def save_key(self, key):
        pass

    def load_key(self, key):
        pass
