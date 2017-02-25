

# Work to do:
* [ ] AKHenry -- setup tags in repo
* [X] Pete -- Finish API docs.
    * [ ] Proof read docs and edit as needed
    * [ ] Document Telemetry Metadata. (what are values, what properties matter?)
        * remove source property.
# DONE

* [X] Supporting new-style telemetry in old telemetry api. (support fixed position)
* [X] Enable time conductor and set default to last fifteen minutes
  * [X] Time Conductor API: Needs to function even if the UI is not enabled.
    * [X] Need realtime/etc to work without it.
* [X] standardize openmct.plugins: they should all be functions that return a plugin.
* [X] Update strategy for tutorial (how are we going to present this code?)
* [X] AKHenry+Pete -- to complete revisions to master for conductor/etc.
* [X] AKHenry -- to complete tutorials
* [X] AKHenry - Updated docs

# Bugs
* [X] Why can't I add telemetry to table or fixed position?
    * containment policy is based on TYPE, not on INSTANCE.  WHY?
    * containment applies when objects

# Decisions to make (or work required for a decision)


# SLIGHTLY LESS IMPORTANT
* [ ] Pete -- publish Open MCT to NPM
* [ ] Need generic telemetry type??
* [X] Clean up composition policy to make sense (no more candidate, context);
* [ ] Limit evaluator registration (it should be a separate registry)
* [ ] enumeration formatting / format services in general.
* [ ] format registry: key -> format class

# UNKNOWN:

* [ ] Fixing object API. (persistence spaces, etc.)
* [ ] Provide python server implementation.
* [X] Ensure new-style points can be added to fixed position.

REPORT LATER:
* Non-expandle items have hover effects where the expand disclosure arrow would be, but don't handle click events.
* Need to figure out how to handle composition policy which is based on type
and also based on "applies to".  (maybe also applies to telemetry checking.)
* Can attempt to save objects in immutable folders-- should check for mutability before containment.




* [X] Determine strategy for finishing all work by next Wednesday. (So fri, tues, weds)  



<!-- change type.cssclass to type.cssClass -->
