#include <iostream>
#include <string>
#include <cstdlib>
#include <fstream>
#include <chrono>
#include <exception>

enum class PrimesAlgorithm { BRUTE_FORCE,  ERATOSTENES_SIEVE, ATKIN_SIEVE };

class PrimesGenerator {
    public:
    PrimesGenerator(int n = 0, PrimesAlgorithm algorithm = PrimesAlgorithm::ERATOSTENES_SIEVE) 
        try : 
        m_n(n),
        m_algoritm(algorithm)
    {
        if (n <= 0)
            throw std::invalid_argument("Only positive numbers allowed! \n * wrong parameter has been given \n * int32 overflow might have occured \n * invalid argument might have been given (not convertable to int)");
        if (n == 1)
            throw "no primes within this range";

        m_primes = new bool[m_n];
        for (int i = 0; i < n; ++i)
            m_primes[i] = true;
    }
    catch (std::invalid_argument& e) {
        std::cout << "ERROR: Invalid constructor parameters!" << std::endl;
        throw; 
    }
    catch (const char* msg) {
        throw;
    }

    static void info() {
        std::cout << "\nThis is simple prime numbers generator" << std::endl;
        std::cout << "Upper bound of numbers within generator can look for primes is the size of 4 byte int ~ 2,147,483,647" << std::endl;
        std::cout << "By default floating point numbers are casted to integers\n" << std::endl;
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
        std::cout << "<=== Saving results to file: \""<< filename << "\" ... ===>" << std::endl;
        std::ofstream resultStream{filename, std::ios::out};

        for (int i = 2; i <= m_n; ++i)
            if (m_primes[i]) resultStream << i << std::endl;

        resultStream.close();
        std::cout << "<=== finished ===>" << std::endl;
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
                for (k = i*i; k <= m_n; k += i)
                    m_primes[k] = false;

        auto finishTime = std::chrono::steady_clock::now();
        std::cout << "<=== Eratostenes sieve finished ===>" << std::endl;
        std::chrono::duration<float> elapsed_seconds = finishTime - startTime;
        std::cout << "<=== Time taken: " << elapsed_seconds.count() << "s ===>" << std::endl;
    }

    void AtkinSieve() {} /// Will be implemented in future :-)

    void BruteForcePrimes() {} /// Will be implemented in future :-)

    int m_n;
    bool* m_primes;
    PrimesAlgorithm m_algoritm;
};


int main(int argc, char* argv[]) {
    if (argc <= 1) {
        std::cout << "Too few command line arguments, please call exe file like: <filename>.exe 100000" << std::endl;
        exit(1);
    }
    int n = atoi(argv[1]);
    PrimesGenerator::info();
    std::cout << "Generate primes up to: " << n << std::endl;
    try {
        PrimesGenerator generator(n);
        generator.setAlgorithm(PrimesAlgorithm::ERATOSTENES_SIEVE);
        generator.run();
        generator.saveToFile("out.txt");
    }
    catch(std::invalid_argument& e) {
        std::cout << e.what() << std::endl;
    }
    catch(const char* msg) {
        std::cout << msg << std::endl;
    }
    return 0;
}