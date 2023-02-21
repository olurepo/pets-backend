createSSHTunnel () 
{
    # rm -rf remote-postgres/
    # mkdir remote-postgres/
    ssh -L 5432:localhost:5432 pgege@ginzan.andrew.cmu.edu -i ~/.ssh/id_rsa_cs858 
}

createSSHTunnel