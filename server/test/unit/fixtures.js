var emptyPage = `<html>
  <head></head>
  <body></body>
</html>
`;

var exampleCom = `<html>
  <head></head>
  <body>
    <header>
      <ul>
        <li>
          <a href="http://www.example.com/something">Same base url link</a>
        </li>
        <li>
          <a href="http://example.com/something-else">Same domain link</a>
        </li>
        <li>
          <a href="http://www.example.org/something">Other domain</a>
        </li>
      </ul>
    </header>
    <article>
      <p>
        Now that there is the <a href="http://example.com/something-2">
        Tec-9</a>, a crappy spray gun from South Miami. This gun is advertised
        as the most popular gun in American crime. Do you believe that shit? It
        actually says that in the little book that comes with it: the most p
        opular gun in American crime. Like they're actually proud of that shit. 
      </p>
    </article>
  </body>
</html>
`;
var exampleComSomething = `<html>
  <head></head>
  <body>
    <header>
      <ul>
        <li>
          <a href="http://www.example.com/something">Same base url link</a>
        </li>
        <li>
          <a href="http://example.com/something-else">Same domain link</a>
        </li>
        <li>
          <a href="http://www.example.org/something">Other domain</a>
        </li>
      </ul>
    </header>
    <article>
      <p>
        Your bones don't break, <a href="http://www.esp.com/">mine do</a>.
        That's clear. <a href="http://www.google.com/">Your cells </a>
        react to bacteria and viruses differently than mine. You don't get 
        <a href="http://example.com/something-3">sick</a>, I do. That's 
        also clear. <a href="http://example.com/something-4">But for some
        reason</a>, you and I react the exact same way to water. We swallow it
        too fast, we choke. We get some in our lungs, we drown. However unreal
        it may seem, we are connected, you and I. We're on the same curve,
        just on opposite ends.
      </p>
    </article>
  </body>
</html>
`;

var exampleOrg = `<html>
  <head></head>
  <body>
    <header>
      <ul>
        <li>
          <a href="http://www.example.org/something">Same base url link</a>
        </li>
        <li>
          <a href="http://example.org/something-else">Same domain link</a>
        </li>
        <li>
          <a href="http://www.example.com/something">Other domain</a>
        </li>
      </ul>
    </header>
    <article>
      <p>
        Now that there is the <a href="http://www.example.org/something2">Tec-9
        </a>, a crappy spray gun from South Miami. This gun is advertised as
        the most popular gun in American crime. Do you believe that shit? It
        actually says that in the little book that comes with it: the most p
        opular gun in American crime. Like they're actually proud of that shit. 
      </p>
    </article>
  </body>
</html>
`;

export default {
  emptyPage: emptyPage,
  exampleCom: exampleCom,
  exampleComSomething: exampleComSomething,
  exampleOrg: exampleOrg
}
