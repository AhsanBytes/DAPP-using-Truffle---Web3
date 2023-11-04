import contract from "@truffle/contract"; 

export const loadContract =  async (name,provider)=>{
    const res = await fetch(`./contracts/${name}.json`);
    const Artifact = res.json();
    const _contract = contract(Artifact);
    _contract.setProvider(provider);
    const deployedContract = await _contract.deployed();
    return deployedContract;
};
//contract name or contract ABI name fetched, and then this json file pass to contract builtin function of truffle
//and provider that is pass as a parameter is set and lastly contract is deployed and exported.