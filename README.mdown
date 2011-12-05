#[objectDiff](http://nv.github.com/objectDiff.js/)

[objectdiff on npm](http://search.npmjs.org/#/objectdiff)


## objectDiff.diff(objectA, objectB)

<pre>
objectDiff.diff({x: 1}, {x: 2})
-> {
  changed: "object change",
  value: {
    x: {
      changed: "primitive change",
      removed: 1,
      added: 2
    }
  }
}

objectDiff.diff({z: {x: 1}}, {z: {y: 2}})
-> {
  changed: "object change",
  value: {
    z: {
      changed: "object change",
      value: {
        x: {
          changed: "removed",
          value: 1
        },
        y: {
          changed: "added",
          value: 2
        }
      }
    }
  }
}
</pre>


## objectDiff.diffOwnProperties(objectA, objectB)

Same as objectDiff.diff, but compares only objects' own properties

<pre>
function A(){}
A.prototype.x = 1
objectDiff.diff({x: 1}, new A)
-> {changed: "equal", value: {x: 1}}

objectDiff.diffOwnProperties({x: 1}, new A)
-> {changed: "object change", value: {x: {changed: "removed", value: 1}}}
</pre>

## objectDiff.convertToXMLString(diffObject)

Used on [the demo page](http://nv.github.com/objectDiff.js/).

## Jasmine integration

objectDiff provides `toEqualProperties` and `toEqualOwnProperties` matchers for [Jasmine](http://pivotal.github.com/jasmine/).
See [example spec](http://nv.github.com/objectDiff.js/spec/).
