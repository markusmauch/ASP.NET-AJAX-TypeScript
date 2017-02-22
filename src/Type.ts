
interface Function
{
    getName(): string;
    isInstanceOfType( instance: any ): boolean;
    implementsInterface( interfaceType ): boolean;
    inheritsFrom( parentType ): boolean;
}

Function.prototype.getName = function()
{
    return Object.getTypeName( this );
}

Function.prototype.isInstanceOfType = function( instance: any )
{
    return instance instanceof this;
}

const Type = Function;
