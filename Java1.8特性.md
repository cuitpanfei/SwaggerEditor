# Java1.8 特性简要学习

------

## 简介
&emsp;&emsp;毫无疑问，Java 8是自Java  5（2004年）发布以来Java语言最大的一次版本升级，Java 8带来了很多的新特性，比如编译器、类库、开发工具和JVM（Java虚拟机）。在这篇教程中我们将会学习这些新特性，并通过真实例子演示说明它们适用的场景。
本教程由下面几部分组成，它们分别涉及到Java平台某一特定方面的内容：

> * 语言
> * 编译器
> * 类库
> * 开发工具
> * 运行时（Java虚拟机）

## Java的新特性
总体来说，Java 8是一个大的版本升级。有人可能会说，Java 8的新特性非常令人期待，但是也要花费大量的时间去学习。这一节我们会讲到这些新特性。

### `Lambda`表达式和函数式接口

`Lambda`表达式（也叫做闭包）是Java 8中最大的也是期待已久的变化。它允许我们将一个函数当作方法的参数（传递函数），或者说把代码当作数据，这是每个函数式编程者熟悉的概念。很多基于JVM平台的语言一开始就支持Lambda表达式，但是Java程序员没有选择，只能使用匿名内部类来替代Lambda表达式。

`Lambda`表达式的设计被讨论了很久，而且花费了很多的功夫来交流。不过最后取得了一个折中的办法，得到了一个新的简明并且紧凑的Lambda表达式结构。最简单的Lambda表达式可以用逗号分隔的参数列表`、->`符号和功能语句块来表示。示例如下：

```java
Arrays.asList("a","b","d").forEach( e -> System.out.println(e));
```
请注意到编译器会根据上下文来推测参数的类型，或者你也可以显示地指定参数类型，只需要将类型包在括号里。举个例子：
```java
Arrays.asList("a","b","d").forEach((String e) -> System.out.println(e));
```
如果`Lambda`的功能语句块太复杂，我们可以用大括号包起来，跟普通的Java方法一样，如下：
```java
Arrays.asList("a","b","d").forEach((String e) -> {
    String separator = ",";
    System.out.print( e + separator)；
});
```
`Lambda`表达式可能会引用类的成员或者局部变量（会被隐式地转变成`final`类型），下面两种写法的效果是一样的：

```java
String separator = ",";
Arrays.asList("a","b","d").forEach((String e) -> System.out.print(e + separator));
```
和
```java
final String separator = ",";
Arrays.asList("a","b","d").forEach((String e) -> System.out.print( e + separator));
```
**上述问题的常见错误使用**：
```java
String separator = ",";
Integer times = 1;
Arrays.asList("a","b","d").forEach((String e) -> {
    separator = "*";//这里常常会在编译的时候报出错误，因为不能给final赋值
    times++;//理由同上
    System.out.print( e + separator)
});
```

Lambda表达式可能会有返回值，编译器会根据上下文推断返回值的类型。如果lambda的语句块只有一行，不需要`return`关键字以及大括号。下面两个写法是等价的：
```java
Arrays.asList("a","b","d").sort((e1, e2) -> e1.compareTo(e2));
```
和
```java
Arrays.asList("a","b","d").sort((e1, e2) -> {
    int result = e1.compareTo( e2 );
    return result;
});
```
语言的设计者们思考了很多如何让现有的功能和lambda表达式友好兼容。于是就有了函数接口这个概念。函数接口是一种只有一个方法的接口，像这样地，函数接口可以隐式地转换成lambda表达式。

`java.lang.Runnable` 和`java.util.concurrent.Callable`是函数接口两个最好的例子。但是在实践中，函数接口是非常脆弱的，只要有人在接口里添加多一个方法，那么这个接口就不是函数接口了，就会导致编译失败。Java 8提供了一个特殊的注解`@FunctionalInterface`来克服上面提到的脆弱性并且显示地表明函数接口的目的（java里所有现存的接口都已经加上了`@FunctionalInterface`）。让我们看看一个简单的函数接口定义：
```java
@FunctionalInterface
public interface Functional {
    void method();
}
```
我们要记住默认的方法和静态方法（下一节会具体解释）不会违反函数接口的约定，例子如下：
```java
@FunctionalInterface
public interface FunctionalDefaultMethods {
    void method();
 
    default void defaultMethod() {
    }
}
```
支持Lambda是Java 8最大的卖点，他有巨大的潜力吸引越来越多的开发人员转到这个开发平台来，并且在纯Java里提供最新的函数式编程的概念。对于更多的细节，请参考[官方文档][1]。

### 接口的默认方法和静态方法
Java 8增加了两个新的概念在接口声明的时候：默认和静态方法。默认方法和Trait有些类似，但是目标不一样。默认方法允许我们在接口里添加新的方法，而不会破坏实现这个接口的已有类的兼容性，也就是说不会强迫实现接口的类实现默认方法。

默认方法和抽象方法的区别是抽象方法必须要被实现，默认方法不是。作为替代方式，接口可以提供一个默认的方法实现，所有这个接口的实现类都会通过继承得倒这个方法（如果有需要也可以重写这个方法），让我们来看看下面的例子：
```java
private interface Defaulable {
    // Interfaces now allow default methods, the implementer may or
    // may not implement (override) them.
    default String notRequired() {
        return "Default implementation";
    }
}
 
private static class DefaultableImpl implements Defaulable {
}
 
private static class OverridableImpl implements Defaulable {
    @Override
    public String notRequired() {
        return "Overridden implementation";
    }
}
```
接口Defaulable使用default关键字声明了一个默认方法notRequired()，类DefaultableImpl实现了Defaulable接口，没有对默认方法做任何修改。另外一个类OverridableImpl重写类默认实现，提供了自己的实现方法。

Java 8 的另外一个有意思的新特性是接口里可以声明静态方法，并且可以实现。例子如下：
```java
private interface DefaulableFactory {
    // Interfaces now allow static methods
    static Defaulable create( Supplier< Defaulable > supplier ) {
        return supplier.get();
    }
}
```
下面是把接口的静态方法和默认方法放在一起的示例（::new 是构造方法引用，后面会有详细描述）：
```java
public static void main( String[] args ) {
    Defaulable defaulable = DefaulableFactory.create( DefaultableImpl::new );
    System.out.println( defaulable.notRequired() );
 
    defaulable = DefaulableFactory.create( OverridableImpl::new );
    System.out.println( defaulable.notRequired() );
}
```
控制台的输出如下:
> Default implementation
> Overridden implementation

JVM平台的接口的默认方法实现是很高效的，并且方法调用的字节码指令支持默认方法。默认方法使已经存在的接口可以修改而不会影响编译的过程。`java.util.Collection`中添加的额外方法就是最好的例子：`stream()`, `parallelStream()`, `forEach()`, `removeIf()`

虽然默认方法很强大，但是使用之前一定要仔细考虑是不是真的需要使用默认方法，因为在层级很复杂的情况下很容易引起模糊不清甚至变异错误。更多的详细信息请参考[官方文档][2]。

### 方法引用

方法引用提供了一个很有用的语义来直接访问类或者实例的已经存在的方法或者构造方法。结合`Lambda`表达式，方法引用使语法结构紧凑简明。不需要复杂的引用。

下面我们用`Car`这个类来做示例，`Car`这个类有不同的方法定义。让我们来看看java 8支持的4种方法引用。
```java
public static class Car {

    public static Car create( final Supplier< Car > supplier ) {
        return supplier.get();
    }              
 
    public static void collide( final Car car ) {
        System.out.println( "Collided " + car.toString() );
    }
 
    public void follow( final Car another ) {
        System.out.println( "Following the " + another.toString() );
    }
 
    public void repair() {
        System.out.println( "Repaired " + this.toString() );
    }
}
```
第一种方法引用是构造方法引用，语法是：`Class::new` ，对于泛型来说语法是：`Class<T >::new`，请注意构造方法没有参数:
```java
final Car car = Car.create( Car::new );
final List< Car > cars = Arrays.asList( car );
```
第二种方法引用是静态方法引用，语法是：`Class::static_method`请注意这个静态方法只支持一个类型为Car的参数。
```java
cars.forEach( Car::collide );
```
第三种方法引用是类实例的方法引用，语法是：`Class::method`请注意方法没有参数。
```java
cars.forEach( Car::repair );
```
最后一种方法引用是引用特殊类的方法，语法是：`instance::method`，请注意只接受Car类型的一个参数。
```java
final Car police = Car.create( Car::new );
cars.forEach( police::follow );
```
运行这些例子我们将会在控制台得到如下信息（Car的实例可能会不一样）:
> Collided com.javacodegeeks.java8.method.references.MethodReferences$Car@7a81197d

> Repaired com.javacodegeeks.java8.method.references.MethodReferences$Car@7a81197d

> Following the com.javacodegeeks.java8.method.references.MethodReferences$Car@7a81197d

###  重复注释

自从Java 5支持注释以来，注释变得特别受欢迎因而被广泛使用。但是有一个限制，同一个地方的不能使用同一个注释超过一次。 Java 8打破了这个规则，引入了重复注释，允许相同注释在声明使用的时候重复使用超过一次。 

重复注释本身需要被`@Repeatable`注释。实际上，他不是一个语言上的改变，只是编译器层面的改动，技术层面仍然是一样的。让我们来看看例子：
```java
package com.javacodegeeks.java8.repeatable.annotations;
 
import java.lang.annotation.ElementType;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
 
public class RepeatingAnnotations {
    @Target( ElementType.TYPE )
    @Retention( RetentionPolicy.RUNTIME )
    public @interface Filters {
        Filter[] value();
    }
 
    @Target( ElementType.TYPE )
    @Retention( RetentionPolicy.RUNTIME )
    @Repeatable( Filters.class )
    public @interface Filter {
        String value();
    };
 
    @Filter( "filter1" )
    @Filter( "filter2" )
    public interface Filterable {
    }
 
    public static void main(String[] args) {
        for( Filter filter: Filterable.class.getAnnotationsByType( Filter.class ) ) {
            System.out.println( filter.value() );
        }
    }
}
```
我们可以看到，注释Filter被`@Repeatable( Filters.class )`注释。Filters 只是一个容器，它持有Filter, 编译器尽力向程序员隐藏它的存在。通过这样的方式，Filterable接口可以被Filter注释两次。

另外，反射的API提供一个新方法`getAnnotationsByType()` 来返回重复注释的类型（请注意`Filterable.class.getAnnotation( Filters.class )`将会返回编译器注入的Filters实例）。

程序的输出将会是这样：

    filter1
    filter2

更多详细信息请参考[官方文档][3]。

### 更好的类型推断

Java 8在类型推断方面改进了很多，在很多情况下，编译器可以推断参数的类型，从而保持代码的整洁。让我们看看例子：

```java
package com.javacodegeeks.java8.type.inference;
 
public class Value<T> {
    public static<T> T defaultValue() {
        return null;
    }
 
    public T getOrDefault( T value, T defaultValue ) {
        return ( value != null ) ? value : defaultValue;
    }
}
```
这里是`Value<String>`的用法
```java
package com.javacodegeeks.java8.type.inference;
 
public class TypeInference {
    public static void main(String[] args) {
        final Value<String> value = new Value<>();
        value.getOrDefault( "22", Value.defaultValue() );
    }
}
```
参数`Value.defaultValue()`的类型被编译器推断出来，不需要显式地提供类型。在java 7, 相同的代码不会被编译，需要写成：`Value.<String>defaultValue()`

###  注解的扩展

Java 8扩展了注解可以使用的范围，现在我们几乎可以在所有的地方：局部变量、泛型、超类和接口实现、甚至是方法的Exception声明。一些例子如下：
```java
package com.javacodegeeks.java8.annotations;
 
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.util.ArrayList;
import java.util.Collection;
 
public class Annotations {
    @Retention( RetentionPolicy.RUNTIME )
    @Target( { ElementType.TYPE_USE, ElementType.TYPE_PARAMETER } )
    public @interface NonEmpty {
    }
 
    public static class Holder< @NonEmpty T > extends @NonEmpty Object {
        public void method() throws @NonEmpty Exception {
        }
    }
 
    @SuppressWarnings( "unused" )
    public static void main(String[] args) {
        final Holder< String > holder = new @NonEmpty Holder< String >();
        @NonEmpty Collection< @NonEmpty String > strings = new ArrayList<>();
    }
}
```
Java 8 新增加了两个注解的程序元素类型ElementType.TYPE_USE 和ElementType.TYPE_PARAMETER ，这两个新类型描述了可以使用注解的新场合。注解处理API（Annotation Processing API）也做了一些细微的改动，来识别这些新添加的注解类型。



  [1]: http://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html
  [2]: http://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html
  [3]: http://docs.oracle.com/javase/tutorial/java/annotations/repeating.html
