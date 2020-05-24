#include <iostream>
#include <string>
#include <fstream>
#include <chrono>

enum class PrimesAlgorithm { BRUTE_FORCE,  ERATOSTENES_SIEVE, ATKIN_SIEVE };

class PrimesGenerator {
    public:
    PrimesGenerator(int n, PrimesAlgorithm algorithm = PrimesAlgorithm::ERATOSTENES_SIEVE) 
        : 
        m_n(n), 
        m_algoritm(algorithm),
        m_primes(new bool[n])
    {
        for (int i = 0; i < n; ++i)
            m_primes[i] = true;
    }

    void setAlgorithm(PrimesAlgorithm algorithm) {
        m_algoritm = algorithm;
    }

    void run() {
        switch (m_algoritm)
        {
        case PrimesAlgorithm::ERATOSTENES_SIEVE:
            EratostenesSieve();
            break;
        case PrimesAlgorithm::ATKIN_SIEVE:
            AtkinSieve();
            break;
        case PrimesAlgorithm::BRUTE_FORCE:
            BruteForcePrimes();
            break;                    
        default:
            break;
        }
    }

    void saveToFile(std::string filename) {
        std::ofstream resultStream{filename, std::ios::out};

        for (int i = 1; i <= m_n; ++i)
            if (m_primes[i]) resultStream << i << std::endl;

        resultStream.close();
    }

    ~PrimesGenerator() {
        delete m_primes;
    }

    private:

    void EratostenesSieve() {
        auto startTime = std::chrono::steady_clock::now();
        std::cout << "<=== Eratostenes sieve start ===>" << std::endl;

        int k;
        for (int i = 2; i*i <= m_n; ++i) 
            if (m_primes[i]) 
                for (k = 2*i; k <= m_n; k += i)
                    m_primes[k] = false;

        auto finishTime = std::chrono::steady_clock::now();
        std::cout << "<=== Eratostenes sieve finished ===>" << std::endl;
        std::chrono::duration<float> elapsed_seconds = finishTime - startTime;
        std::cout << "<=== Time taken: " << elapsed_seconds.count() << "s ===>" << std::endl;
    }

    void AtkinSieve() {}

    void BruteForcePrimes() {}

    int m_n;
    PrimesAlgorithm m_algoritm;
    bool* m_primes;
};


int main(int argc, char* argv[]) {
    int n = atoi(argv[1]);
    std::cout << "Generate primes up to: " << n << std::endl;
    PrimesGenerator generator(n);
    generator.setAlgorithm(PrimesAlgorithm::ERATOSTENES_SIEVE);

    generator.run();
    // generator.saveToFile("out.txt");
    return 0;
}