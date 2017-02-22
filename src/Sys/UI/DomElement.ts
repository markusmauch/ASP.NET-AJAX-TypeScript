
module Sys.UI
{
    export class DomElement
    {
        /**
         * Adds a CSS class to a DOM element if the class is not already part of the DOM element. This member is static and can be invoked without creating an instance of the class.
         * @param element
         *      The {HTMLElement} object to add the CSS class to.
         * @param className
         *      The name of the CSS class to add.
         */
        public static addCssClass( element: HTMLElement, className: string )
        {
            if ( !Sys.UI.DomElement.containsCssClass( element, className ) )
            {
                if ( element.className === "" )
                {
                    element.className = className;
                }
                else
                {
                    element.className += ' ' + className;
                }
            }
        }

        /**
         * Gets a value that indicates whether the DOM element contains the specified CSS class. This member is static and can be invoked without creating an instance of the class.
         * @param element
         *      The {@link HTMLElement} object to test for the CSS class.
         * @param className
         *      The name of the CSS class to test for.
         * @returns
         *      true if the element contains the specified CSS class; otherwise, false.
         */
        public static containsCssClass ( element: HTMLElement, className: string )
        {
            return Array.contains( element.className.split( " " ), className );
        }

        /**
         * Gets a set of integer coordinates that represent the position, width, and height of a DOM element. This member is static and can be invoked without creating an instance of the class.
         * @param element
         *      The Sys.UI.DomElement instance to get the coordinates of.
         * @returns
         *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the upper-left corner, the width, and the height of the element in pixels.
         */
        public static getBounds( element: HTMLElement )
        {
            let offset = Sys.UI.DomElement.getLocation( element );
            return new Sys.UI.Bounds(offset.x, offset.y, element.offsetWidth || 0, element.offsetHeight || 0);
        }
        
        /**
         * Gets a DOM element that has the specified id attribute. This member is static and can be invoked without creating an instance of the class.
         * @param id
         *      The ID of the element to find.
         * @param element
         *      The parent element to search in. The default is the document element.
         * @returns
         *      The {@link HTMLElement} object with the specified ID.
         */
        public static getElementById( id: string, element: HTMLElement )
        {
            return element.querySelector( "#" + id );
        }

        /**
         * Gets the absolute position of a DOM element relative to the upper-left corner of the owner frame or window. This member is static and can be invoked without creating an instance of the class.
         * @param element
         *      The target element.
         * @returns
         *      An object of the JavaScript type Object that contains the x-coordinate and y-coordinate of the element in pixels.
         */
        public static getLocation( element: HTMLElement )
        {
            return new Bounds();
        }
    }
}