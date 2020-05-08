import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import StoreService from '@ember-data/store';
import CurrentUserService, { currentUserId } from 'emberclear/services/current-user';
import ChatScroller from 'emberclear/services/chat-scroller';

interface IModelParams {
  id: string;
}

export default class ChatPrivatelyRoute extends Route {
  @service currentUser!: CurrentUserService;
  @service chatScroller!: ChatScroller;
  @service toast!: Toast;
  @service intl!: Intl;
  @service store!: StoreService;

  beforeModel(transition: any) {
    let params = transition.to.params;
    let { id } = params as IModelParams;

    if (id === this.currentUser.uid) {
      this.transitionTo('chat.privately-with', currentUserId);
    }

    // Tells the view to scroll to the bottom.
    // TODO: is there a way to do this with just CSS?
    this.chatScroller.isLastVisible = true;
  }

  async model(params: IModelParams) {
    const { id } = params;

    let record;

    try {
      if (id === currentUserId) {
        record = this.currentUser.record;
      } else {
        record = await this.store.findRecord('contact', id);
      }
    } catch (error) {
      this.toast.error(error || this.intl.t('ui.chat.errors.contactNotFound'));

      this.transitionTo('chat.index');
    }

    return {
      targetIdentity: record,
    };
  }
}
