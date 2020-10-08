const EventSystem= function()
{
	const eventStack= {};

	class EventSystem{

		static createEvent(event, detail)
		{
			const evt= new Event(event);
			evt.detail= detail;
			eventStack[event]= new Event(event);
		}

		static dispatchEvent(event)
		{
			if(eventStack[event]) window.dispatchEvent(eventStack[event]);
		}
	}

	return EventSystem;
}();

export default EventSystem;
