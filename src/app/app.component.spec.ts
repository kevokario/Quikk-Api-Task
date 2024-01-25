import {MockBuilder,MockRender,MockedComponentFixture,ngMocks} from "ng-mocks";
import {AppComponent} from "./app.component";
import {AppModule} from "./app.module";

describe("AppComponent",function(){

  let fixture:MockedComponentFixture<AppComponent>;
  let component:AppComponent;
  ngMocks.faster();

  beforeAll(function(){
    return MockBuilder(AppComponent,AppModule);
  });

  beforeAll(function () {
    fixture = MockRender(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })

  it("Should create",function(){
    //arrange

    //act

    //assert
    expect(component).toBeTruthy()

  });

});
