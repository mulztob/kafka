import { Component, h, State } from '@stencil/core';
import { getMessages } from '../../kafka.worker';

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
  private timerId: number;

  componentWillLoad() {
    const oldTimerId = window.sessionStorage.getItem(this.interval);
    clearInterval(oldTimerId);

    const newTimerId = setInterval(
      async () => {
        const { newOffset, msg } = await getMessages(this.offset);
        this.offset = newOffset;
        this.changeCounter += msg.length;
        this.thing = this.thing.length > 20 ? msg : this.thing.concat(msg);
      },
      250,
      '',
    );
    this.timerId = newTimerId;
    console.log(`will load, old timer: ${oldTimerId}, new timer ${newTimerId}`);
    window.sessionStorage.setItem(this.interval, newTimerId.toString());
  }

  componentShouldUpdate() {
    console.log('update, timerId:', this.timerId);
    return this.changeCounter > 10;
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
