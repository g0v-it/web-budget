import Configuration from "@/utils/configuration";

import * as moment from "moment";
import "moment/locale/it";

moment.locale(Configuration.current().locale);

export default moment;
