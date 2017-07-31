

# Babel Legacy Decorator plugin

This is a plugin for Babel 6 that is meant to replicate the old decorator behavior from
Babel 5 in order to allow people to more easily transition to Babel 6 without needing to
be blocked on updates to the decorator proposal or for Babel to re-implement it.

## Why "legacy"?

Decorators are still only a relatively new proposal, and they are (at least currently) still
in flux. Many people have started to use them in their original form, where each decorator
is essentially a function of the form

    function(target, property, descriptor){}

This form is very likely to change moving forward, and Babel 6 did not wish to support
the older form when it was known that it would change in the future. As such, I created this
plugin to help people transition to Babel 6 without requiring them to drop their decorators
or requiring them to wait for the new proposal update and then update all their code.

## Best Effort

This plugin is a best effort to be compatible with Babel 5's transpiler output, but there
are a few things that were difficult to reproduce, and a few things that were simply incorrect
in Babel 5 with respect to the decorators proposal.

Two main things to mention as differences, though not things you are likely to encounter:

1. Decorators expressions are evaluated top to bottom, and executed bottom to top. e.g.

    ```
    function dec(id){
        console.log('evaluated', id);
        return (target, property, descriptor) => console.log('executed', id);
    }

    class Example {
        @dec(1)
        @dec(2)
        method(){}
    }
    ```

    In Babel 5, this would output:

    ```
    evaluated 2
    evaluated 1
    executed 2
    executed 1
    ```

    With this plugin, it will result in:

    ```
    evaluated 1
    evaluated 2
    executed 2
    executed 1
    ```

    which is what the spec dictates as the correct behavior and was incorrect in Babel 5.

2. Static class property initializers are evaluated once up front.

    If you decorate a static class property, you will get a descriptor with an `initializer` property.
    However whereas with Babel 5 this could be re-executed multiple times with potentially differing
    results, `decorators-legacy` will precompute the value and return an initializer that will
    return that value. e.g.

    ```
    function dec(target, prop, descriptor){
        let {initializer} = descriptor;
        delete descriptor.initializer;
        delete descriptor.writable;

        descriptor.get = function(){
            return initializer.call(this);
        };
    }

    var i = 0;

    class Example {
        @dec
        static prop = i++;
    }
    ```

    In Babel 5, every access to `prop` would increment `i`.
    In Babel 6, the very first value of `i` will be cached for future `initializer` calls.

    The spec is a little vague around how initializers work for repeat calls, and I'd consider
    calling an `initializer` multiple times to be a mistake in general, so hopefully this will
    not cause anyone trouble.

## License

MIT (c) 2015
