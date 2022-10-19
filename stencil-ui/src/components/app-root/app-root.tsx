import { Component, Env, h, State } from '@stencil/core';
import { getMessages } from '../../kafka.worker';
// import {worker} from '../../kafka.worker.ts?worker';

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
    // console.log(`will load, old timer: ${oldTimerId}, new timer ${newTimerId}`);
    window.sessionStorage.setItem(this.interval, newTimerId.toString());
  }

  connectedCallback() {
    console.log('connectedCallback');
  }
  componentDidLoad() {
    console.log('componentDidLoad');
  }
  componentDidRender() {
    console.log('componentDidRender');
  }
  componentDidUpdate() {
    console.log('componentDidUpdate');
  }
  disconnectedCallback() {
    console.log('disconnectedCallback');
  }
  componentWillRender() {
    console.log('componentWillRender');
  }
  componentWillUpdate() {
    console.log('componentWillUpdate');
  }
  componentShouldUpdate() {
    console.log('componentShouldUpdate');
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
