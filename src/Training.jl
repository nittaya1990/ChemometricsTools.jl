using StatsBase

forceMatrix(a) = (length(size(a)) == 1) ? reshape( a, length(a), 1 ) : a

function SplitByProportion(X,Y, Proportion = 0.5)
    Y = forceMatrix(Y)
    FirstChunk = Int(floor(size(X)[1] * Proportion))
    return ((X[1:FirstChunk,:], Y[1:FirstChunk,:]), (X[(FirstChunk+1):end,:], Y[(FirstChunk+1):end,:])   )
end

function Shuffle( X, Y )
    Inds = StatsBase.sample( collect(1 : size(X)[1] ), size(X)[1], replace = false )
    return( X[Inds,:], Y[Inds,:] )
end

function Shuffle!( X, Y )
    Inds = StatsBase.sample( collect(1 : size(X)[1] ), size(X)[1], replace = false )
    X .= X[Inds,:]
    Y .= Y[Inds,:]
end

VenetianBlinds(X) = ( X[1:2:end], X[2:2:end] )
VenetianBlinds(X,Y) = (( X[1:2:end], Y[1:2:end] ), ( X[2:2:end], Y[2:2:end] ) )

struct KFoldsValidation
    K::Int
    FoldSize::Int
    observations::Int
    X
    Y
end

KFoldsValidation(K, x, y) = KFoldsValidation( K, floor(size( x )[ 1 ] / K), size( x )[ 1 ], x, y)
LeaveOneOut(x,y) = KFoldsValidation( size( x )[ 1 ], 1, size( x )[ 1 ], x, y )

function Base.iterate( iter::KFoldsValidation, state = 0 )
    i = state;
    predictInds = []; trainInds = []; holdoutInds = []

    if i == 0
        holdoutInds = collect( 1 : iter.FoldSize )
        trainInds = collect( ( iter.FoldSize + 1 ) : iter.observations )
    elseif i < iter.K
        holdoutInds = collect( ( ( i * iter.FoldSize ) + 1 ) : ( ( i + 1 ) * iter.FoldSize ) )
        trainInds = [collect( 1 : ( i * iter.FoldSize ) );
                    collect( ( ( ( i + 1 ) * iter.FoldSize ) + 1 ) : iter.observations ) ]
    else
        return nothing
    end

    return (    ((iter.X[trainInds,:], iter.Y[trainInds]),
                ((iter.X[holdoutInds,:], iter.Y[holdoutInds]))),
                (i + 1) )
end
