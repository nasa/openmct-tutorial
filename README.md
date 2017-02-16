

First Priority:
Taxonomy (what do we call this thing?  It's an object provider.  measurements are objects too!)

Second Priority:
==> Telemetry Providers
==> Also: supporting new-style telemetry in old telemetry api. (support fixed position)


Third Priority:
Fixing object API. (persistence spaces, etc.)

Fourth Priority:
What do we use to simplify AJAX for tutorial.

End of tomorrow:
* These things done, plus an outline of the tutorial.
* Should be ready to complete this.
* Provide python server implementation

# Bugs

Non-expandle items have hover effects where the expand disclosure arrow would be, but don't handle click events.

Need to figure out how to handle composition policy which is based on type
and also based on "applies to".  (maybe also applies to telemetry checking.)

Can attempt to save objects in immutable folders-- should check for mutability before containment.

* Enable time conductor and set default to last fifteen minutes

* standardize openmct.plugins: either they all are a function that returns a plugin or they are all a plugin.

* Finalize realtime adapter / API.
* separate historical and realtime servers.

* Time Conductor API: Needs to function even if the UI is not enabled.
  * Need realtime/etc to work without it.

As is:
  * run serve .
  * run history (app.js)
  * run realtime?


NEed generic telemetry type??

Document Telemetry Metadata. (what are values, what properties matter?)

<!-- change type.cssclass to type.cssClass -->
