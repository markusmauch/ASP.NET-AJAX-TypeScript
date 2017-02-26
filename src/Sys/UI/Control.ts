module Sys.UI
{
    export class Control extends Sys.Component
    {
        constructor( element: HTMLElement )
        {
            super();
            this._element = element;
        }

        protected _element: HTMLElement;

        public get_element()
        {
            return this._element;
        }
    }

    export interface ControlProps extends ComponentProps
    {}
}