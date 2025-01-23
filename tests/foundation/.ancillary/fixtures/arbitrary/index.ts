'use strict';

import _happy_case from './happy-case.oas.json' with { type: "json" };
import no_merge from './no-merge.oas.json' with { type: "json" };
import no_description from './no-description.oas.json' with { type: "json" };

const happy_case = _happy_case as Record<string, any>;

export {
    happy_case,
    no_merge,
    no_description
};

const index = {
    happy_case,
    no_merge,
    no_description
};

export default index;