import React, { useState, useEffect } from 'react';
import SHA256 from 'crypto-js/sha256'; // For hashing
import './App.css'; 

function App() {
    const [difficulty, setDifficulty] = useState(4); // State for global difficulty

    // State for Block 1
    const [amount1, setAmount1] = useState(70);
    const [transaction1, setTransaction1] = useState("0x0000->0x0000");
    const [nonce1, setNonce1] = useState(0);
    const [hash1, setHash1] = useState('0');
    const [miningTime1, setMiningTime1] = useState(0);
    const [isValid1, setIsValid1] = useState(false);
    const previousHash1 = '0'; // Genesis block has a previous hash of '0'

    // State for Block 2
    const [amount2, setAmount2] = useState(70);
    const [transaction2, setTransaction2] = useState("0x0000->0x0000");
    const [nonce2, setNonce2] = useState(0);
    const [hash2, setHash2] = useState('0');
    const [miningTime2, setMiningTime2] = useState(0);
    const [isValid2, setIsValid2] = useState(false);
    const [previousHash2, setPreviousHash2] = useState(''); // Linked to hash1

    // State for Block 3
    const [amount3, setAmount3] = useState(70);
    const [transaction3, setTransaction3] = useState("0x0000->0x0000");
    const [nonce3, setNonce3] = useState(0);
    const [hash3, setHash3] = useState('0');
    const [miningTime3, setMiningTime3] = useState(0);
    const [isValid3, setIsValid3] = useState(false);
    const [previousHash3, setPreviousHash3] = useState(''); // Linked to hash2


    //  function to calculate hash
    const calculateHash = (amount, transaction, prevHash, nonce) => {
        return SHA256(String(amount) + String(transaction) + String(prevHash) + String(nonce)).toString();
    };

    // Effect for Block 1: Recalculate hash and validity when its data or difficulty changes
    useEffect(() => {
        setNonce1(0); // Reset nonce when data changes
        setMiningTime1(0);
        const newHash = calculateHash(amount1, transaction1, previousHash1, 0);
        setHash1(newHash);
        const valid = newHash.startsWith("0".repeat(difficulty));
        setIsValid1(valid);
        if (valid) {
            setPreviousHash2(newHash); // Link Block 2 to Block 1's new valid hash
        } else {
            setPreviousHash2(''); // Invalidate link if Block 1 is not valid
        }
    }, [amount1, transaction1, difficulty]); // Only previousHash1 is constant, so not a dependency

    // Effect for Block 2: Recalculate hash and validity when its data, previousHash, or difficulty changes
    useEffect(() => {
        setNonce2(0); // Reset nonce when data changes
        setMiningTime2(0);
        const newHash = calculateHash(amount2, transaction2, previousHash2, 0);
        setHash2(newHash);
        const valid = newHash.startsWith("0".repeat(difficulty));
        setIsValid2(valid);
        if (valid) {
            setPreviousHash3(newHash); // Link Block 3 to Block 2's new valid hash
        } else {
            setPreviousHash3(''); // Invalidate link if Block 2 is not valid
        }
    }, [amount2, transaction2, previousHash2, difficulty]);

    // Effect for Block 3: Recalculate hash and validity when its data, previousHash, or difficulty changes
    useEffect(() => {
        setNonce3(0); // Reset nonce when data changes
        setMiningTime3(0);
        const newHash = calculateHash(amount3, transaction3, previousHash3, 0);
        setHash3(newHash);
        const valid = newHash.startsWith("0".repeat(difficulty));
        setIsValid3(valid);
    }, [amount3, transaction3, previousHash3, difficulty]);

    // Function made for mining a block
    const mineBlock = (blockNumber) => {
        let currentNonce, setNonce, setHash, setMiningTime, setIsValid, currentAmount, currentTransaction, currentPreviousHash;

        // Assign state variables based on blockNumber
        if (blockNumber === 1) {
            currentNonce = nonce1; setNonce = setNonce1; setHash = setHash1; setMiningTime = setMiningTime1; setIsValid = setIsValid1;
            currentAmount = amount1; currentTransaction = transaction1; currentPreviousHash = previousHash1;
        } else if (blockNumber === 2) {
            currentNonce = nonce2; setNonce = setNonce2; setHash = setHash2; setMiningTime = setMiningTime2; setIsValid = setIsValid2;
            currentAmount = amount2; currentTransaction = transaction2; currentPreviousHash = previousHash2;
        } else if (blockNumber === 3) {
            currentNonce = nonce3; setNonce = setNonce3; setHash = setHash3; setMiningTime = setMiningTime3; setIsValid = setIsValid3;
            currentAmount = amount3; currentTransaction = transaction3; currentPreviousHash = previousHash3;
        } else {
            return; // Invalid block number
        }

        const start = performance.now();
        let nonceVal = currentNonce;
        let newHash = "";
        const prefix = "0".repeat(difficulty);

        // Mining loop
        while (true) {
            newHash = calculateHash(currentAmount, currentTransaction, currentPreviousHash, nonceVal);
            if (newHash.startsWith(prefix)) {
                break; // Founds a valid hash
            }
            nonceVal++;
        }
        const end = performance.now();

        setNonce(nonceVal);
        setHash(newHash);
        setMiningTime((end - start).toFixed(3));
        setIsValid(true);

        // Update subsequent blocks' previous hashes if this block is successfully mined
        if (blockNumber === 1) setPreviousHash2(newHash);
        if (blockNumber === 2) setPreviousHash3(newHash);
    };

    // Handler for difficulty change, also resets the blockchain
    const handleDifficultyChange = (e) => {
        const newDifficulty = Number(e.target.value);
        setDifficulty(newDifficulty);
        // Reset all blocks when difficulty changes
        setAmount1(70); setTransaction1("0x0000->0x0000"); setNonce1(0); setHash1('0'); setMiningTime1(0); setIsValid1(false);
        setAmount2(70); setTransaction2("0x0000->0x0000"); setNonce2(0); setHash2('0'); setMiningTime2(0); setIsValid2(false); setPreviousHash2('');
        setAmount3(70); setTransaction3("0x0000->0x0000"); setNonce3(0); setHash3('0'); setMiningTime3(0); setIsValid3(false); setPreviousHash3('');
    };


    // --- Consensus Mechanism Simulation (Task 3) ---
    const simulateConsensus = () => {
        const miners = [
            { id: 'Miner A', power: Math.floor(Math.random() * 100) + 1 },
            { id: 'Miner B', power: Math.floor(Math.random() * 100) + 1 },
            { id: 'Miner C', power: Math.floor(Math.random() * 100) + 1 }
        ];

        const stakers = [
            { id: 'Staker X', stake: Math.floor(Math.random() * 1000) + 100 },
            { id: 'Staker Y', stake: Math.floor(Math.random() * 1000) + 100 },
            { id: 'Staker Z', stake: Math.floor(Math.random() * 1000) + 100 }
        ];

        const voters = [
            { id: 'Voter 1', votes: 50 },
            { id: 'Voter 2', votes: 120 },
            { id: 'Voter 3', votes: 80 }
        ];
        
        // Proof-of-Work (PoW)
        const selectedMiner = miners.reduce((prev, current) => (prev.power > current.power) ? prev : current);
        console.log("--- Proof-of-Work (PoW) Simulation ---");
        console.log(`Miners: ${JSON.stringify(miners)}`);
        console.log(`Selected validator for PoW: ${selectedMiner.id} with power ${selectedMiner.power}`);
        console.log("Explanation: In PoW, the validator (miner) with the highest computational 'power' (representing hash rate) is chosen to add the next block, after solving a cryptographic puzzle.");

        // Proof-of-Stake (PoS)
        const selectedStaker = stakers.reduce((prev, current) => (prev.stake > current.stake) ? prev : current);
        console.log("\n--- Proof-of-Stake (PoS) Simulation ---");
        console.log(`Stakers: ${JSON.stringify(stakers)}`);
        console.log(`Selected validator for PoS: ${selectedStaker.id} with stake ${selectedStaker.stake}`);
        console.log("Explanation: In PoS, the validator (staker) with the largest 'stake' (amount of cryptocurrency held and locked) has a higher chance of being selected to create the next block.");

       
        const totalVotes = voters.reduce((sum, voter) => sum + voter.votes, 0);
        let randomVoteIndex = Math.random() * totalVotes;
        let selectedDelegate = null;
        for (const voter of voters) {
            randomVoteIndex -= voter.votes;
            if (randomVoteIndex <= 0) {
                selectedDelegate = voter;
                break;
            }
        }
        console.log("\n--- Delegated Proof-of-Stake (DPoS) Simulation ---");
        console.log(`Delegates (Voters): ${JSON.stringify(voters)}`);
        console.log(`Selected validator for DPoS: ${selectedDelegate.id} (based on weighted random selection from votes)`);
        console.log("Explanation: In DPoS, token holders vote for delegates to validate transactions. The selected delegate is often chosen based on their accumulated votes, sometimes through a weighted random process or a fixed schedule among the top voted.");
    };


    return (
        <>
            <div className="heading"><h1>Blockchain Simulation</h1></div>
            <div className='subheading'>
                <h4>Difficulty:
                    <input
                        className='inp'
                        type="number"
                        min="1"
                        max="7"
                        value={difficulty}
                        onChange={handleDifficultyChange}
                    />
                </h4>
            </div>

            <div className="card"> {/* This is our .blocks-container */}
                {/* Block #1 */}
                <div className={`card1 ${isValid1 ? 'valid' : ''}`}>
                    <h3>Block #1</h3>
                    <h3>Data</h3>
                    <h3>Amount:
                        <div>
                            <input
                                className='amount'
                                type="number"
                                min="-1000"
                                max="1000"
                                value={amount1}
                                onChange={(e) => setAmount1(Number(e.target.value))}
                            />
                        </div>
                    </h3>
                    <h3>Transaction:
                        <div>
                            <input
                                className='transaction'
                                type="text"
                                value={transaction1}
                                onChange={(e) => setTransaction1(e.target.value)}
                            />
                        </div>
                    </h3>
                    <div>
                        <h3>Previous Hash: <span className="hash-display">{previousHash1}</span></h3>
                        <div>
                            <h3>Hash:</h3>
                            <span className={`hash-display ${isValid1 ? 'valid-hash' : 'invalid-hash'}`}>{hash1}</span>
                        </div>
                        <h3>Nonce: <span className="nonce-display">{nonce1}</span></h3>
                    </div>
                    <button type="button" className='mine-block' onClick={() => mineBlock(1)}>Mine Block</button>
                    <h3 className="mining-time">Mined in : {miningTime1} ms</h3>
                </div>

                {/* Block #2 */}
                <div className={`card1 ${isValid2 ? 'valid' : ''}`}>
                    <h3>Block #2</h3>
                    <h3>Data</h3>
                    <h3>Amount:
                        <div>
                            <input
                                className='amount'
                                type="number"
                                min="-1000"
                                max="1000"
                                value={amount2}
                                onChange={(e) => setAmount2(Number(e.target.value))}
                            />
                        </div>
                    </h3>
                    <h3>Transaction:
                        <div>
                            <input
                                className='transaction'
                                type="text"
                                value={transaction2}
                                onChange={(e) => setTransaction2(e.target.value)}
                            />
                        </div>
                    </h3>
                    <div>
                        <h3>Previous Hash: <span className="hash-display">{previousHash2 || 'Not Linked / Invalid'}</span></h3> {/* Display appropriate message */}
                        <div>
                            <h3>Hash:</h3>
                            <span className={`hash-display ${isValid2 ? 'valid-hash' : 'invalid-hash'}`}>{hash2}</span>
                        </div>
                        <h3>Nonce: <span className="nonce-display">{nonce2}</span></h3>
                    </div>
                    <button type="button" className='mine-block' onClick={() => mineBlock(2)}>Mine Block</button>
                    <h3 className="mining-time">Mined in : {miningTime2} ms</h3>
                </div>

                {/* Block #3 */}
                <div className={`card1 ${isValid3 ? 'valid' : ''}`}>
                    <h3>Block #3</h3>
                    <h3>Data</h3>
                    <h3>Amount:
                        <div>
                            <input
                                className='amount'
                                type="number"
                                min="-1000"
                                max="1000"
                                value={amount3}
                                onChange={(e) => setAmount3(Number(e.target.value))}
                            />
                        </div>
                    </h3>
                    <h3>Transaction:
                        <div>
                            <input
                                className='transaction'
                                type="text"
                                value={transaction3}
                                onChange={(e) => setTransaction3(e.target.value)}
                            />
                        </div>
                    </h3>
                    <div>
                        <h3>Previous Hash: <span className="hash-display">{previousHash3 || 'Not Linked / Invalid'}</span></h3> {/* Display appropriate message */}
                        <div>
                            <h3>Hash:</h3>
                            <span className={`hash-display ${isValid3 ? 'valid-hash' : 'invalid-hash'}`}>{hash3}</span>
                        </div>
                        <h3>Nonce: <span className="nonce-display">{nonce3}</span></h3>
                    </div>
                    <button type="button" className='mine-block' onClick={() => mineBlock(3)}>Mine Block</button>
                    <h3 className="mining-time">Mined in : {miningTime3} ms</h3>
                </div>
            </div>

            {/* Consensus Mechanism Simulation Button (Task 3) */}
            <div style={{ marginTop: '50px', textAlign: 'center' }}>
                <button 
                    type="button" 
                    className="mine-block" 
                    onClick={simulateConsensus}
                    style={{width: 'auto', padding: '15px 30px', fontSize: '1.4em'}}
                >
                    Simulate Consensus
                </button>
                <p style={{marginTop: '20px', fontSize: '0.9em', color: '#b0b0b0'}}>
                    (Check console for consensus mechanism output)
                </p>
            </div>
        </>
    );
}

export default App;