import { Component, Env, h, State } from '@stencil/core';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  @State() thing: string;

  private readonly backend = Env['BACKEND'];

  //FIXME: consider alternate to socket. move socket/service to webworker
  private readonly socket = new WebSocket(this.backend);

  private listener = (e: MessageEvent<string>) => {
    this.thing = e.data;
  };

  connectedCallback() {
    this.socket.onmessage = this.listener;
    this.socket.onopen = () => (this.thing = 'socket ready');
    this.socket.onerror = e => {
      this.thing = 'connection error';
      console.error(e);
    };
  }

  disconnectedCallback() {
    // this.socket.removeEventListener('message', this.listener);
    this.socket.close();
    this.thing = 'socket closed';
  }

  render() {
    return (
      <div>
        <header>
          <h1>Stencil Kafka UI</h1>
        </header>

        <main>backend:{this.backend}</main>
        <p>thing: {this.thing}</p>
      </div>
    );
  }
}
