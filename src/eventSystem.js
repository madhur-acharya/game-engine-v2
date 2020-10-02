const EventSystem= function()
{
	const eventStack= {};

	class EventSystem{

		static createEvent(event)
		{
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
