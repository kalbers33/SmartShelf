//@module
/*
  Copyright 2011-2014 Marvell Semiconductor, Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

exports.pins = {
    scannedWeight: {type: "I2C", address: 0x52}
};

exports.configure = function () {
	this.scannedWeight.init();
}

exports.close = function() {
    this.scannedWeight.close();
}

exports.read = function () {
    var data = this.scannedWeight.readWordDataSMB(0);
	var value = ((data & 0xFF) << 4) | ((data >> 8) >> 4);
	if (value & 0x800) {
	    value -= 1;
	    value = ~value & 0xFFF;
        value = -value;
    }

    value *= 0.0625;

    return value;
}
