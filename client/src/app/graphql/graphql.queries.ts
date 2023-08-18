import {gql} from 'apollo-angular'

const GET_INTERACTIONS = gql`
    query {
        proteinById (uniprotid : "Q9Y692") {
            ensembl_ids
            gene_ids
            interacting_proteins1 {
              interactor {
                uniprotid
              }
              databases
              score
            }
          }
        }
`
      
export {GET_INTERACTIONS}
