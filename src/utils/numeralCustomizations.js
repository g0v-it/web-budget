import Configuration from "@/utils/configuration";

import numeral from "numeral";

let umIsSetted = false;

function init(um = "€") {
  if (!umIsSetted) {
    numeral.register("locale", "it", {
      delimiters: {
        thousands: ".",
        decimal: ","
      },
      abbreviations: {
        thousand: "mila",
        million: "milioni",
        billion: "miliardi",
        trillion: "trilioni"
      },
      ordinal: function(number) {
        return "º";
      },
      currency: {
        symbol: um
      }
    });
    numeral.locale(Configuration.current().locale);
    umIsSetted = true;
  }

  return numeral;
}
// import 'numeral/locales';

export default init;
