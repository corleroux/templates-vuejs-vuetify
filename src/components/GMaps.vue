<template xmlns:v-gmaps-searchbox="http://www.w3.org/1999/xhtml">
  <div id="app">
    <h1>{{ msg }}</h1>
    <button @click="formatAddress(lead.address)">format address</button>
    <pre>{{ myaddress | json }}</pre>
    <input v-model="vm.searchPlace" v-gmaps-searchbox:address="lead" />
    <pre>{{ vm | json }}</pre>
    <pre>{{ lead | json }}</pre>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Hello Vue Maps!",
      myaddress: {},
      lead: {
        address: {}
      },
      vm: {
        searchPlace: "",
        location: {}
      }
    };
  },
  methods: {
    formatAddress(ggl_address) {
      var address_components = ggl_address.address_components;
      var ShouldBeComponent = {
        streetnumber: ["street_number"],
        //postal_code: ["postal_code"],
        streetname: ["street_address", "route"],
        province: [
          "administrative_area_level_1",
          "administrative_area_level_2",
          "administrative_area_level_3",
          "administrative_area_level_4",
          "administrative_area_level_5"
        ],
        suburb: [
          "sublocality",
          "sublocality_level_1",
          "sublocality_level_2",
          "sublocality_level_3",
          "sublocality_level_4"
        ],
        area: ["locality"]
        //country: ["country"]
      };

      var address = {
        latitude: 0,
        longitude: 0,
        suburb: "",
        area: "",
        province: "",
        streetnumber: "",
        streetname: ""
      };
      address_components.forEach(component => {
        for (var shouldBe in ShouldBeComponent) {
          if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
            if (shouldBe === "country") {
              address[shouldBe] = component.short_name;
            } else {
              address[shouldBe] = component.long_name;
            }
          }
        }
      });
      address.latitude = ggl_address.geometry.location.lat();
      address.longitude = ggl_address.geometry.location.lng();
      this.myaddress = address;
      return myaddress;
    }
  }
};
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
