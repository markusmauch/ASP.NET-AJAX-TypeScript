
let $create = Sys.Component.create;

/**
 * Provides a shortcut to the {@link getElementById} method of the {@link Sys.UI.DomElement} class.
 * This member is static and can be invoked without creating an instance of the class.
 * @param id
 *      The ID of the DOM element to find.
 * @param element
 *      The parent element to search. The default is the document element.
 */
function $get( id: string, element?: HTMLElement )
{
    return Sys.UI.DomElement.getElementById( id, element );
}

