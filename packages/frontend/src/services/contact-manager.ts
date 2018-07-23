import DS from 'ember-data';
import Service from '@ember/service';
import { service } from '@ember-decorators/service';

import Identity from 'emberclear/data/models/identity/model';

import { fromHex } from 'emberclear/src/utils/string-encoding';

export default class ContactManager extends Service {
  @service store!: DS.Store;

  async findOrCreate(uid: string, name: string): Promise<Identity> {
    try {
      let record = await this.find(uid);

      // always update the name
      record.set('name', name);

      return record;
    } catch (e) {
      const publicKey = fromHex(uid);

      let record = this.store.createRecord('identity', {
        id: uid,
        publicKey,
        name
      });

      await record.save();

      return record;
    }
  }

  async allContacts(): Promise<Identity[]> {
    const identities = await this.store.findAll('identity');

    return identities.filter(i => i.id !== 'me');
  }

  async addContact(info: any) {
    try {
      // const existing = this.find(info.id);

      // return? error?
    } catch (e) {
      // maybe find should do the try/catching...
      // seems weird to try/catch every time we want to use find
    }
  }

  async find(uid: string) {
    return await this.store.findRecord('identity', uid);
  }
}