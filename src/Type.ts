
interface Function
{
    getName(): string;
    isInstanceOfType( instance: any ): boolean;
    implementsInterface( interfaceType: Function ): boolean;
    inheritsFrom( parentType: Function ): boolean;
}

Function.prototype.getName = function()
{
    return Object.getTypeName( this );
}

Function.prototype.isInstanceOfType = function( instance: any )
{
    return instance instanceof this;
}

Function.implementsInterface = function( interfaceType: Function )
{
	return this instanceof interfaceType;
}

Function.inheritsFrom = function( parentType: Function )
{
	return this instanceof parentType;
}

const Type = Function;
