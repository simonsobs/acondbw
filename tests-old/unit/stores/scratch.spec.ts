import { setActivePinia, createPinia } from "pinia";
import { defineStore } from "pinia";

console.log("before useAStore()");
const useAStore = defineStore("A", () => {
  console.log("in defineStore()");
  return { a: 1 };
});
// const useAStore = (() => {
//   console.log("in useAStore()");
//   return defineStore("A", () => {
//     console.log("in defineStore()");
//     return { a: 1 };
//   });
// })();
console.log("after useAStore()");

describe("scratch", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("one", () => {
    console.log("in one()");
    const aStore = useAStore();
    console.log("end one()");
  });
});
