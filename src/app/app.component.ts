import { Component, OnInit } from '@angular/core';
import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory/lib/fragmentMatcher';
//import {Apollo, gql} from 'apollo-angular';
import fragmentTypes from '../../src/utils/fragmentTypes.json';
var InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
var ApolloClient = require("apollo-client").ApolloClient;
var gql = require("graphql-tag");
var PrismicLink = require("apollo-link-prismic").PrismicLink;

const fragmentMatcher = new IntrospectionFragmentMatcher(
  { introspectionQueryResultData: fragmentTypes },
);
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'schema-page';
  prismicData = {};
  loading = true;
  error: any;
  url: string = '/plop';
  notFound = false;

  //constructor(private apollo: Apollo) {}

   client = new ApolloClient({
    link: PrismicLink({
      uri: "https://sunrise-app.prismic.io/graphql"
    }),
    cache: new InMemoryCache({ fragmentMatcher })
  });

  ngOnInit() {

    this.client.query({
      query: gql`
      query{
        page(uid:"plop",lang:"en-us"){
          url
          body{
            ... on PageBodyCardsGroupSmall{
              fields{
                cardsgroupsmall{
                  ... on CardSmall{
                    title
                    cardImage
                    cardLink
                    cardBackgroundColor
                    ismobile
                  }
                }
              }
            }
          ... on PageBodyCardsGroupMedium{
            fields{
              cardsGroupMedium{
                ... on CardMedium{
                  title
                  cardImg
                  cardBtnText
                  cardBtnLink
                  cardBackgroundColor
                  ismobile
                  }
                }
              }
            }
          }   
        }
      }
      `
    }).then((response: any) => {
      let cardsGroupSmall : Object;
      let cardsGroupMedium: Object;
      //console.log('response : ', response);      
      //this.prismicData = response;
      if(response.data.page.url === this.url === false){
        this.notFound = true      
        return;
      }     
      response.data.page.body.map((elem:any, index: number ) => (        
        elem.__typename === 'PageBodyCardsGroupSmall' ? cardsGroupSmall = elem.fields : console.log(),
        elem.__typename === 'PageBodyCardsGroupMedium' ? cardsGroupMedium = elem.fields : console.log()        
      ));
      //console.log('small cards group :', cardsGroupSmall);
      //console.log('medium cards group :', cardsGroupMedium);
      this.prismicData = {
        'cardsGroupSmall' : cardsGroupSmall,
        'cardsGroupMedium' : cardsGroupMedium
      }
      console.log(this.prismicData);         
    }).catch((error: any) => {
      console.error(error);
    });


   /*  this.apollo
      .watchQuery({
        query: gql`
        query{
          page(uid:"plop",lang:"en-us"){
            _linkType
           
            }
        }
        `,
      })
      .valueChanges.subscribe((result: any) => {
        this.rates = result?.data?.rates;
        this.loading = result.loading;
        this.error = result.error;
        console.log(result);
      }); */
/* 
      this.apollo.query({
        query: gql`
        query{
          page(uid:"plop",lang:"en-us"){
            _linkType
           
            }
        }
        `
      }).subscribe((result: any) => {
        console.log(result)
      }) */
  }
}
