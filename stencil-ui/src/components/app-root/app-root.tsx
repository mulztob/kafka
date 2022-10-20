import { Component, Env, h, State } from '@stencil/core';
import { getMessages, getMessagesCallback } from '../../kafka.worker';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() thing: string[] = [];
  private offset: number = 0;
  private changeCounter: number = 0;
  private readonly interval = 'intervalId';
  //FIXME: spawns new web workers in dev mode w/o killing old ones... meaning websockets accumulate as well
  componentWillLoad() {
    console.log('componentWillLoad');

    this.getMessageInterval();
    // getMessagesCallback(Env['BACKEND'], newMsg => this.getMessagesCallback(newMsg));
  }

  private getMessagesCallback(newMsg: string[]) {
    this.changeCounter += newMsg.length;
    this.thing = this.thing.length > 20 ? newMsg : this.thing.concat(newMsg);
  }

  private getMessageInterval() {
    const oldTimerId = window.sessionStorage.getItem(this.interval);
    clearInterval(oldTimerId);
    const newTimerId = setInterval(
      async () => {
        const { newOffset, msg } = await getMessages(Env['BACKEND'], this.offset);
        this.offset = newOffset;
        this.changeCounter += msg.length;
        this.thing = this.thing.length > 20 ? msg : this.thing.concat(msg);
      },
      250,
      '',
    );
    console.log(`will load, old timer: ${oldTimerId}, new timer ${newTimerId}`);
    window.sessionStorage.setItem(this.interval, newTimerId.toString());
  }

  componentShouldUpdate() {
    if (this.changeCounter > 10) {
      this.changeCounter = 0;
      return true;
    }
  }

  render() {
    return (
      <div>
        <header>
          <h1>Stencil Kafka UI</h1>
        </header>
        <main>
          <button onClick={() => alert('still responsive')}>click for alert</button>

          {this.thing?.map(item => (
            <p>{item}</p>
          ))}
        </main>
      </div>
    );
  }
}
