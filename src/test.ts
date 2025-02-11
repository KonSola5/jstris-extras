class Greeter {
  greeting: string;
  constructor(message: string) {
      this.greeting = message;
  }
  greet() {
      return "Hello, " + this.greeting;
  }
}

const originalFunciton = Greeter.prototype.greet;

Greeter.prototype.greet = function () {
  alert('In Monkey Patched Function');
  const returnValue = originalFunciton.apply(this); 
  return returnValue;
};

const greeter = new Greeter("world");

const button = document.createElement('button');
button.textContent = "Say Hello";
button.onclick = function() {
  alert(greeter.greet());
}

document.body.appendChild(button);