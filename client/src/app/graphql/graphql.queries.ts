import {gql} from 'apollo-angular'

const GET_INTERACTIONS = gql`
    query {
        proteinById (uniprotid : "Q9Y692") {
            uniprotid
            ensembl_ids
            gene_ids
            interacting_proteins1 {
              interactor {
                uniprotid
                ensembl_ids
                gene_ids
              }
              databases
              score
            }
            interacting_proteins2 {
              interactor {
                uniprotid
                ensembl_ids
                gene_ids
              }
              databases
              score
            }
          }
        }
`
      
export {GET_INTERACTIONS}
